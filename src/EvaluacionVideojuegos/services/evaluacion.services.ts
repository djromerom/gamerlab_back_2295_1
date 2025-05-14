import { Injectable, NotFoundException,ConflictException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  async createEvaluacion(
    idUsuario: number,
    idVideojuego: number,
    criterios: { id_criterio: number; valoracion: string }[],
    comentario: string,
  ) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: { id_videojuego: idVideojuego, estado: true },
    });

    if (!videojuego) {
      throw new NotFoundException(
        `El videojuego con ID ${idVideojuego} no existe o no está disponible.`,
      );
    }

    const evaluacionExistente = await this.prisma.evaluacion.findFirst({
      where: { id_usuario: idUsuario, id_videojuegos: idVideojuego, estado: true },
    });

    if (evaluacionExistente) {
      throw new ConflictException(
        `El usuario con ID ${idUsuario} ya ha evaluado el videojuego con ID ${idVideojuego}.`,
      );
    }

    const evaluacion = await this.prisma.evaluacion.create({
      data: {
        id_usuario: idUsuario,
        id_videojuegos: idVideojuego,
        comentario: comentario,
        estado: true,
        fecha_creacion: new Date(),
      },
    });
    const criteriosEvaluacion = criterios.map((criterio) => ({
      id_criterio: criterio.id_criterio,
      id_evaluacion: evaluacion.id_evaluacion,
      valoracion: criterio.valoracion,
      estado: true,
      fecha_creacion: new Date(),
    }));

    await this.prisma.criterio_evaluacion.createMany({
      data: criteriosEvaluacion,
    });

    return {
      message: 'Evaluación creada exitosamente',
      evaluacion,
      criteriosEvaluacion,
    };
  }

  async getEvaluacionesByUsuario(idUsuario: number) {
    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: { id_usuario: idUsuario, estado: true },
      select: {
        id_evaluacion: true,
        id_usuario: true,
        id_videojuegos: true,
        comentario: true,
        fecha_creacion: true,

        criterio_evaluacion: {
          select: {
            id_criterio: true,
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

    if (evaluaciones.length === 0) {
      throw new NotFoundException(
        'No hay ninguna evaluación realizada por este usuario.',
      );
    }

    return evaluaciones.map((evaluacion) => ({
      ...evaluacion,
      criterio_evaluacion: evaluacion.criterio_evaluacion.map((criterio) => ({
        id_criterio: criterio.id_criterio,
        nombre_criterio: criterio.criterio.nombre,
        valoracion: criterio.valoracion,
      })),
    }));
  }

  async getEvaluacionByVideojuegoAndUsuario(
    id_videojuego: number,
    id_usuario: number,
  ) {
    const evaluacion = await this.prisma.evaluacion.findFirst({
      where: {
        id_videojuegos: id_videojuego,
        id_usuario: id_usuario,
        estado: true,
      },
      select: {
        id_evaluacion: true,
        id_usuario: true,
        id_videojuegos: true,
        comentario: true,
        fecha_creacion: true,
        criterio_evaluacion: {
          select: {
            id_criterio: true,
            valoracion: true,
            criterio: {
              select: {
                nombre: true,
                porcentaje: true,
              },
            },
          },
        },
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(
        `No se encontró una evaluación para el videojuego con ID ${id_videojuego} realizada por el usuario con ID ${id_usuario}.`,
      );
    }

    const contribuciones = evaluacion.criterio_evaluacion.map(
      (criterioEval) => {
        const peso = criterioEval.criterio.porcentaje || 0;
        const nota = parseFloat(criterioEval.valoracion) || 0;
        return peso * nota;
      },
    );

    const notaFinal = contribuciones.reduce((sum, val) => sum + val, 0);

    return { ...evaluacion, notaFinal };
  }

}
