import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminUsuarioService {
  constructor(private PrismaService: PrismaService) {}
  // CRUD de Usuarios
  async createUsuario(data: {
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido: string;
    correo: string;
    ultima_conexion?: Date;
    password?: string;
    id_rol: number;
  }) {
    console.log('DATA RECIBIDA:', data);
    const usuario = await this.PrismaService.usuario.create({
      data: {
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        correo: data.correo,
        password: data.password,
        confirmado: false,
        estado: true,
        ultima_conexion: new Date(),
        token_confirmacion: 'fsddsfsdfsdf',
      },
    });
    const usuario_rol = await this.PrismaService.usuario_rol.create({
      data: {
        id_rol: data.id_rol,
        id_usuario: usuario.id_usuario,
        estado: true,
      },
    });
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
}
