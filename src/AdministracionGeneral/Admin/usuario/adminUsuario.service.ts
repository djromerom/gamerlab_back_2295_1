import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from './email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUsuarioService {
  constructor(
    private PrismaService: PrismaService,
    private mailService: MailService,
  ) {}
  // CRUD de Usuarios
  async createUsuario(data: {
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido: string;
    correo: string;
    ultima_conexion?: Date;
    //password?: string;
    id_rol: number;
  }) {
    console.log('DATA RECIBIDA:', data);
    // Verificar si el correo ya existe
    const usuarioExistente = await this.PrismaService.usuario.findUnique({
      where: {
        correo: data.correo,
      },
    });
    if (usuarioExistente) {
      this.addRolToUsuario(usuarioExistente.id_usuario, data.id_rol);
      throw new BadRequestException(
        `El correo ${data.correo} ya está registrado`,
      );
    }
    // Verificar si el rol existe
    this.validarRolActivo(data.id_rol);
    const token = randomUUID();
    const usuario = await this.PrismaService.usuario.create({
      data: {
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        correo: data.correo,
        //password: data.password,
        confirmado: false,
        estado: true,
        ultima_conexion: new Date(),
        token_confirmacion: token,
      },
    });
    const usuario_rol = await this.PrismaService.usuario_rol.create({
      data: {
        id_rol: data.id_rol,
        id_usuario: usuario.id_usuario,
        estado: true,
      },
    });
    const rol = await this.PrismaService.rol.findUnique({
      where: {
        id_rol: data.id_rol,
      },
    });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${data.id_rol} no encontrado`);
    }
    // Enviar correo de confirmación
    await this.mailService.sendWelcomeEmail(usuario.correo, token, rol.rol);
    return {
      ...usuario,
      usuario_rol: usuario_rol,
    };
  }

  async getUsuarios() {
    const usuarios = await this.PrismaService.usuario.findMany({
      where: {
        estado: true,
      },
      include: {
        usuario_rol: {
          where: {
            estado: true,
          },
          include: {
            rol: {
              select: {
                id_rol: true,
                rol: true,
              },
            },
          },
        },
      },
    });

    const usuariosConDetalles = usuarios.map((usuario) => {
      const usuarioRolesNombre = usuario.usuario_rol.map((usuarioRol) => ({
        id_rol: usuarioRol.rol.id_rol,
        nombre: usuarioRol.rol.rol,
      }));

      return {
        ...usuario,
        usuario_roles: usuarioRolesNombre,
      };
    });

    return usuariosConDetalles;
  }

  async getUsuariosByRol(id_rol: number) {
    // Verificar si el rol existe
    await this.validarRolActivo(id_rol);
    const usuarios = await this.PrismaService.usuario.findMany({
      where: {
        estado: true,
        usuario_rol: {
          some: {
            id_rol: id_rol,
            estado: true,
          },
        },
      },
    });
    return usuarios;
  }

  async getUsuarioById(id_usuario: number) {
    const usuario = await this.PrismaService.usuario.findUnique({
      where: {
        id_usuario: id_usuario,
        estado: true,
      },
    });
    if (!usuario) {
      throw new NotFoundException(`usuario con id ${id_usuario} no encontrado`);
    }
    return usuario;
  }

  async updateUsuario(
    id_usuario: number,
    data: {
      primer_nombre?: string;
      segundo_nombre?: string;
      primer_apellido?: string;
      segundo_apellido?: string;
      token_confirmacion?: string;
      confirmado?: boolean;
      correo?: string;
      ultima_conexion?: Date;
    },
  ) {
    await this.validarUsuarioActivo(id_usuario);
    const updatedUsuario = await this.PrismaService.usuario.update({
      where: { id_usuario },
      data: {
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        token_confirmacion: data.token_confirmacion,
        confirmado: data.confirmado,
        correo: data.correo,
        ultima_conexion: data.ultima_conexion,
      },
    });
    return updatedUsuario;
  }

  async deleteUsuario(id_usuario: number, id_rol: number) {
    await this.validarUsuarioActivo(id_usuario);
    await this.validarRolActivo(id_rol);
    if (id_rol === 3) {
      const NrcsUsuario = await this.PrismaService.nrc.findMany({
        where: {
          id_usuario: id_usuario,
          estado: true,
        },
      });
      if (NrcsUsuario.length > 0) {
        throw new BadRequestException(
          `El usuario con id ${id_usuario} tiene nrcs asignados`,
        );
      }
    }
    await this.removeRolFromUsuario(id_usuario, id_rol);
    const usuario_rol = await this.PrismaService.usuario_rol.findFirst({
      where: {
        id_usuario: id_usuario,
        estado: true,
      },
    });
    if (!usuario_rol) {
      await this.PrismaService.usuario.update({
        where: { id_usuario: id_usuario },
        data: { estado: false },
      });
    }
    return {
      message: `Usuario con id ${id_usuario} eliminado`,
    };
  }

  async addRolToUsuario(id_usuaio: number, id_rol: number) {
    await this.validarUsuarioActivo(id_usuaio);
    await this.validarRolActivo(id_rol);

    const usuario_rolExistente = await this.PrismaService.usuario_rol.findFirst(
      {
        where: {
          id_usuario: id_usuaio,
          id_rol: id_rol,
          estado: true,
        },
      },
    );
    // Verificar si el rol ya existe para el usuario
    if (usuario_rolExistente) {
      throw new NotFoundException(
        `El rol con id ${id_rol} ya existe para el usuario con id ${id_usuaio}`,
      );
    }
    const usuario_rol = await this.PrismaService.usuario_rol.create({
      data: {
        id_usuario: id_usuaio,
        id_rol: id_rol,
        estado: true,
      },
    });
    return usuario_rol;
  }

  async removeRolFromUsuario(id_usuario: number, id_rol: number) {
    await this.validarUsuarioActivo(id_usuario);
    await this.validarRolActivo(id_rol);

    const usuario_rol = await this.PrismaService.usuario_rol.findFirst({
      where: {
        id_usuario: id_usuario,
        id_rol: id_rol,
        estado: true,
      },
    });
    if (!usuario_rol) {
      throw new NotFoundException(
        `El rol con id ${id_rol} no existe para el usuario con id ${id_usuario}`,
      );
    }
    const usuario_rolEliminado =
      await this.PrismaService.usuario_rol.updateMany({
        where: {
          id_rol: usuario_rol.id_rol,
          id_usuario: usuario_rol.id_usuario,
          estado: true,
        },
        data: {
          estado: false,
        },
      });
    return {
      message: `Rol con id ${id_rol} eliminado del usuario con id ${id_usuario}`,
      usuario_rolEliminado,
    };
  }

  private async validarUsuarioActivo(id_usuario: number) {
    const usuario = await this.PrismaService.usuario.findUnique({
      where: {
        id_usuario: id_usuario,
      },
    });
    if (!usuario || !usuario.estado) {
      throw new NotFoundException(
        `usuario con id ${id_usuario} no encontrado o inactivo`,
      );
    }
  }

  private async validarRolActivo(id_rol: number) {
    const rol = await this.PrismaService.rol.findUnique({
      where: {
        id_rol: id_rol,
      },
    });
    if (!rol || !rol.estado) {
      throw new NotFoundException(
        `rol con id ${id_rol} no encontrado o inactivo`,
      );
    }
  }

  async confirmEmail(token: string) {
    try {
      const user = await this.PrismaService.usuario.findFirst({
        where: { token_confirmacion: token },
      });

      if (!user) {
        throw new NotFoundException('Token inválido o expirado');
      }

      if (user.confirmado) {
        throw new BadRequestException(
          'El correo ya ha sido confirmado anteriormente',
        );
      }

      const updatedUser = await this.updateUsuario(user.id_usuario, {
        confirmado: true,
        token_confirmacion: '',
      });

      return {
        message: 'Correo confirmado exitosamente',
        user: {
          id: updatedUser.id_usuario,
          nombre: `${updatedUser.primer_nombre} ${updatedUser.primer_apellido}`,
          correo: updatedUser.correo,
        },
      };
    } catch (error) {
      console.error('Error al confirmar correo:', error);
      throw error;
    }
  }

  async setPassword(token: string, password: string) {
    const user = await this.PrismaService.usuario.findFirst({
      where: { token_confirmacion: token },
    });
    if (!user) throw new NotFoundException('Token inválido');

    const hashed = await bcrypt.hash(password, 10);
    await this.PrismaService.usuario.update({
      where: { id_usuario: user.id_usuario },
      data: {
        password: hashed,
        token_confirmacion: '', // Limpia el token
        confirmado: true,
      },
    });
    return { message: 'Contraseña creada exitosamente' };
  }

  async reenviarInvitacion(idUsuario: number, idRol: number) {
    // Verificamos si el usuario existe y no está confirmado
    const usuario = await this.PrismaService.usuario.findFirst({
      where: {
        id_usuario: idUsuario,
        confirmado: false,
        estado: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o ya confirmado');
    }
    // Verificamos si el usuario tiene el rol
    const usuarioRol = await this.PrismaService.usuario_rol.findFirst({
      where: {
        id_usuario: idUsuario,
        id_rol: idRol,
        estado: true,
      },
    });
    if (!usuarioRol) {
      throw new NotFoundException('El usuario no tiene el rol especificado');
    }
    // Verificamos si el rol existe
    const rol = await this.PrismaService.rol.findUnique({
      where: {
        id_rol: idRol,
      },
    });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    // Generamos un nuevo token de confirmación
    const token = randomUUID();

    // Actualizamos el token en la base de datos
    await this.PrismaService.usuario.update({
      where: { id_usuario: idUsuario },
      data: { token_confirmacion: token },
    });

    // Reenviamos el correo de bienvenida con el nuevo token
    await this.mailService.sendWelcomeEmail(usuario.correo, token, rol.rol);

    return {
      message: 'Correo de invitación reenviado exitosamente',
      usuario: {
        id: usuario.id_usuario,
        nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
        correo: usuario.correo,
      },
    };
  }
}
