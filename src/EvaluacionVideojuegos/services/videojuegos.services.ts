import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VideojuegosService {
  constructor(private prisma: PrismaService) {}

  async getAllVideojuegos() {
    const videojuegos = await this.prisma.videojuego.findMany({
      select: {
        id_videojuego: true,
        id_equipo: true,
        nombre: true,
        descripcion: true,
        evaluacion: {
          select: {
            id_evaluacion: true,
            criterio_evaluacion: {
              select: {
                criterio: {
                  select: {
                    nombre: true,
                    porcentaje: true,
                  },
                },
                valoracion: true,
              },
            },
          },
        },
      },
    });

    if (videojuegos.length === 0) {
      throw new NotFoundException(
        'No se encontraron videojuegos en la base de datos.',
      );
    }

    const videojuegosConNotas = videojuegos.map((videojuego) => {
      if (videojuego.evaluacion.length > 0) {
        const notas = videojuego.evaluacion.flatMap((evaluacion) =>
          evaluacion.criterio_evaluacion.map((criterioEval) => {
            const peso = criterioEval.criterio.porcentaje;
            const nota = parseFloat(criterioEval.valoracion);
            return peso * nota;
          }),
        );
        const notaFinal = notas.reduce((sum, nota) => sum + nota, 0);
        return { ...videojuego, notaFinal };
      }
      return { ...videojuego, notaFinal: null };
    });

    return videojuegosConNotas;
  }

  async getVideojuegoById(id_videojuego: number, id_usuario: number) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: { id_videojuego },
      select: {
        id_videojuego: true,
        id_equipo: true,
        nombre: true,
        descripcion: true,
        equipo: {
          select: {
            id_equipo: true,
            nombre: true,
            integrante: {
              select: {
                primer_nombre: true,
              },
            },
          },
        },
        evaluacion: {
          where: { id_usuario },
          select: {
            id_evaluacion: true,
            criterio_evaluacion: {
              select: {
                criterio: {
                  select: {
                    nombre: true,
                    porcentaje: true,
                  },
                },
                valoracion: true,
              },
            },
          },
        },
      },
    });

    if (!videojuego) {
      throw new NotFoundException(
        `No se encontró el videojuego con ID ${id_videojuego}.`,
      );
    }

    let notaFinal: number | null = null;
    if (videojuego.evaluacion.length > 0) {
      const contribuciones = videojuego.evaluacion.flatMap((evaluacion) =>
        evaluacion.criterio_evaluacion.map((criterioEval) => {
          const peso = criterioEval.criterio.porcentaje || 0;
          const nota = parseFloat(criterioEval.valoracion) || 0;
          return peso * nota;
        }),
      );
      notaFinal = contribuciones.reduce((sum, val) => sum + val, 0);
    }

    return { ...videojuego, notaFinal };
  }

  async getVideojuegosNoEvaluadosPorUsuario(id_usuario: number) {
    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: { id_usuario },
      select: { id_videojuegos: true },
    });

    const idsEvaluados = evaluaciones.map((e) => e.id_videojuegos);

    const videojuegosNoEvaluados = await this.prisma.videojuego.findMany({
      where: {
        id_videojuego: {
          notIn: idsEvaluados,
        },
      },
      select: {
        id_videojuego: true,
        id_equipo: true,
        nombre: true,
        descripcion: true,
      },
    });

    if (videojuegosNoEvaluados.length === 0) {
      throw new NotFoundException(
        `Todos los videojuegos han sido evaluados por el usuario con ID ${id_usuario}.`,
      );
    }

    return videojuegosNoEvaluados;
  }

  async getAllVideojuegosByUsuario(id_usuario: number) {
    const videojuegos = await this.prisma.videojuego.findMany({
      select: {
        id_videojuego: true,
        id_equipo: true,
        nombre: true,
        descripcion: true,
        evaluacion: {
          where: { id_usuario }, // Filtra las evaluaciones por el id_usuario
          select: {
            id_evaluacion: true,
            criterio_evaluacion: {
              select: {
                criterio: {
                  select: {
                    nombre: true, // Nombre del criterio
                    porcentaje: true, // Peso del criterio
                  },
                },
                valoracion: true, // Nota obtenida en el criterio
              },
            },
          },
        },
      },
    });

    if (videojuegos.length === 0) {
      throw new NotFoundException(
        `No se encontraron videojuegos evaluados por el usuario con ID ${id_usuario}.`,
      );
    }

    // Calcula la nota final para cada videojuego (si tiene evaluaciones)
    const videojuegosConNotas = videojuegos.map((videojuego) => {
      if (videojuego.evaluacion.length > 0) {
        const notas = videojuego.evaluacion.flatMap((evaluacion) =>
          evaluacion.criterio_evaluacion.map((criterioEval) => {
            const peso = criterioEval.criterio.porcentaje;
            const nota = parseFloat(criterioEval.valoracion);
            return peso * nota; // Calcula la contribución ponderada
          }),
        );
        const notaFinal = notas.reduce((sum, nota) => sum + nota, 0); // Suma las contribuciones
        return { ...videojuego, notaFinal };
      }
      return { ...videojuego, notaFinal: null }; // Si no tiene evaluaciones, la nota es null
    });

    return videojuegosConNotas;
  }
}
