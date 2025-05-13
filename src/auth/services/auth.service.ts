import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(correo: string, password: string) {
    const user = await this.prisma.usuario.findFirst({
      where: {
        correo: correo,
        estado: true,
        confirmado: true, // Verificar que el usuario esté confirmado
        password: { not: null }, // Verificar que tenga contraseña establecida
        usuario_rol: {
          some: {
            rol: {
              rol: 'Jurado',
              estado: true
            },
            estado: true
          }
        }
      },
      include: {
        usuario_rol: {
          include: {
            rol: true
          }
        }
      }
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Usuario no encontrado o cuenta no confirmada');
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      // Actualizar última conexión
      await this.prisma.usuario.update({
        where: { id_usuario: user.id_usuario },
        data: { ultima_conexion: new Date() }
      });

      const payload = {
        sub: user.id_usuario,
        correo: user.correo,
        rol: 'Jurado'
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id_usuario: user.id_usuario,
          nombre: `${user.primer_nombre} ${user.primer_apellido}`,
          correo: user.correo,
          rol: 'Jurado',
          evaluaciones: await this.prisma.evaluacion.count({
            where: {
              id_usuario: user.id_usuario,
              estado: true
            }
          })
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Error al validar credenciales');
    }
  }
}