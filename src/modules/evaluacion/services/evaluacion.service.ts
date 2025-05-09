import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EvaluacionService {
  constructor(private readonly prisma: PrismaService) {}

  async getEvaluacionesByUsuario(idUsuario: number) {
    // 1. Verificar si el usuario tiene el rol de jurado
    const usuarioEsJurado = await this.prisma.usuario_rol.findFirst({
      where: {
        id_usuario: idUsuario,
        id_rol: 2, // Rol de jurado
        estado: true,
      },
    });

    if (!usuarioEsJurado) {
      throw new ForbiddenException('Este usuario no tiene permisos de jurado.');
    }

    // 2. Obtener evaluaciones con criterios evaluados y nombre del criterio
    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: {
        id_usuario: idUsuario,
        estado: true,
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
      select: {
        id_evaluacion: true,
        id_videojuegos: true,
        comentario: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
        criterio_evaluacion: {
          select: {
            valoracion: true,
            criterio: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!evaluaciones.length) {
      throw new NotFoundException('Este jurado no ha realizado evaluaciones.');
    }

    // 3. Formatear respuesta
    return evaluaciones.map((ev) => ({
      id_evaluacion: ev.id_evaluacion,
      id_videojuegos: ev.id_videojuegos,
      comentario: ev.comentario,
      fecha_creacion: ev.fecha_creacion,
      fecha_actualizacion: ev.fecha_actualizacion,
      criterios: ev.criterio_evaluacion.map((ce) => ({
        nombre: ce.criterio.nombre,
        valoracion: ce.valoracion,
      })),
    }));
  }
}
