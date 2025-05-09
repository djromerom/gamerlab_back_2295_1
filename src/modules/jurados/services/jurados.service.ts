import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MailService } from '../../../shared/mail/mail.service';
import { CreateJuradoDto } from '../dto/create-jurado.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JuradosService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createJuradoDto: CreateJuradoDto) {
    try {
      const existingUser = await this.prisma.usuario.findFirst({
        where: { correo: createJuradoDto.correo },
      });

      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      const token = Math.random().toString(36).substring(2, 15);

      // Primero obtenemos o creamos el rol de JURADO
      let rolJurado = await this.prisma.rol.findFirst({
        where: { rol: 'Jurado' },
      });

      if (!rolJurado) {
        // Si no existe el rol, lo creamos
        rolJurado = await this.prisma.rol.create({
          data: {
            rol: 'Jurado',
            estado: true,
          },
        });
      }

      // Creamos el usuario y asignamos el rol en una transacción
      const user = await this.prisma.$transaction(async (prisma) => {
        const newUser = await prisma.usuario.create({
          data: {
            primer_nombre: createJuradoDto.primer_nombre,
            segundo_nombre: createJuradoDto.segundo_nombre,
            primer_apellido: createJuradoDto.primer_apellido,
            segundo_apellido: createJuradoDto.segundo_apellido,
            correo: createJuradoDto.correo,
            token_confirmacion: token,
            confirmado: false,
            estado: true,
            ultima_conexion: new Date(),
          },
        });

        // Asignamos el rol de JURADO
        await prisma.usuario_rol.create({
          data: {
            id_usuario: newUser.id_usuario,
            id_rol: rolJurado.id_rol,
            estado: true,
          },
        });

        return newUser;
      });

      // Enviamos el correo de confirmación
      await this.mailService.sendWelcomeEmail(user.correo, token);

      return {
        message: 'Jurado creado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.',
        user: {
          id: user.id_usuario,
          nombre: `${user.primer_nombre} ${user.primer_apellido}`,
          correo: user.correo,
        },
      };
    } catch (error) {
      console.error('Error al crear jurado:', error);
      throw error;
    }
  }

  async findAll() {
    // Obtener todos los usuarios activos que son jurados
    return this.prisma.usuario.findMany({
      where: {
        estado: true,
        usuario_rol: {
          some: {
            rol: {
              rol: 'Jurado'
            },
          },
        },
      },
      include: {
        usuario_rol: {
          where: {
            rol: {
              rol: 'Jurado'
            }
          },
          include: {
            rol: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findFirst({
      where: { 
        id_usuario: id,
        estado: true,
        usuario_rol: {
          some: {
            rol: {
              rol: 'Jurado'
            }
          }
        }
      },
      include: {
        usuario_rol: {
          include: {
            rol: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Jurado no encontrado');
    }

    return user;
  }

  async confirmEmail(token: string) {
    try {
      const user = await this.prisma.usuario.findFirst({
        where: { token_confirmacion: token },
      });

      if (!user) {
        throw new NotFoundException('Token inválido o expirado');
      }

      if (user.confirmado) {
        throw new BadRequestException('El correo ya ha sido confirmado anteriormente');
      }

      const updatedUser = await this.prisma.usuario.update({
        where: { id_usuario: user.id_usuario },
        data: {
          confirmado: true,
          token_confirmacion: '',
        },
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
    const user = await this.prisma.usuario.findFirst({
      where: { token_confirmacion: token },
    });
    if (!user) throw new NotFoundException('Token inválido');

    const hashed = await bcrypt.hash(password, 10);
    await this.prisma.usuario.update({
      where: { id_usuario: user.id_usuario },
      data: {
        password: hashed,
        token_confirmacion: '', // Limpia el token
        confirmado: true,
      },
    });
    return { message: 'Contraseña creada exitosamente' };
  }

  async deleteJurado(idUsuario: number) {
    // Verificar si el usuario existe y es jurado
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        id_usuario: idUsuario,
        estado: true,
        usuario_rol: {
          some: {
            rol: {
              rol: 'Jurado'
            }
          }
        }
      }
    });

    if (!usuario) {
      throw new NotFoundException('Jurado no encontrado o ya fue eliminado');
    }

    // Realizar eliminación lógica en una transacción
    const result = await this.prisma.$transaction(async (prisma) => {
      // Desactivar el rol de jurado
      await prisma.usuario_rol.updateMany({
        where: {
          id_usuario: idUsuario,
          rol: {
            rol: 'Jurado'
          }
        },
        data: {
          estado: false
        }
      });

      // Desactivar el usuario
      const usuarioDesactivado = await prisma.usuario.update({
        where: {
          id_usuario: idUsuario
        },
        data: {
          estado: false
        }
      });

      return usuarioDesactivado;
    });

    return {
      message: 'Jurado eliminado exitosamente',
      id: result.id_usuario
    };
  }

  async eliminarJurado(idJurado: number) {
    // Verificar si el jurado existe y está activo
    const jurado = await this.prisma.usuario.findFirst({
      where: {
        id_usuario: idJurado,
        estado: true,
        usuario_rol: {
          some: {
            rol: {
              rol: 'Jurado'
            }
          }
        }
      }
    });

    if (!jurado) {
      throw new NotFoundException('Jurado no encontrado o ya ha sido eliminado');
    }

    // Eliminación lógica: actualizar estado a false
    await this.prisma.$transaction([
      // Marcar el rol de jurado como inactivo
      this.prisma.usuario_rol.updateMany({
        where: {
          id_usuario: idJurado,
          rol: {
            rol: 'Jurado'
          }
        },
        data: {
          estado: false
        }
      }),
      // Marcar el usuario como inactivo
      this.prisma.usuario.update({
        where: {
          id_usuario: idJurado
        },
        data: {
          estado: false
        }
      })
    ]);

    return {
      message: 'Jurado desactivado exitosamente',
      id: idJurado
    };
  }

  async reenviarInvitacion(idUsuario: number) {
    // Verificamos si el usuario existe y no está confirmado
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        id_usuario: idUsuario,
        confirmado: false,
        usuario_rol: {
          some: {
            rol: {
              rol: 'Jurado'
            }
          }
        }
      }
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o ya confirmado');
    }

    // Generamos un nuevo token de confirmación
    const token = Math.random().toString(36).substring(2, 15);

    // Actualizamos el token en la base de datos
    await this.prisma.usuario.update({
      where: { id_usuario: idUsuario },
      data: { token_confirmacion: token }
    });

    // Reenviamos el correo de bienvenida con el nuevo token
    await this.mailService.sendWelcomeEmail(usuario.correo, token);

    return {
      message: 'Correo de invitación reenviado exitosamente',
      usuario: {
        id: usuario.id_usuario,
        nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
        correo: usuario.correo
      }
    };
  }
}