import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MonitoreoService {
  constructor(private PrismaService: PrismaService) {}

  async getCountEquipos() {
    return await this.PrismaService.equipo.count({
      where: {
        estado: true,
        id_estado: 2,
      },
    });
  }

  async getCountVideojuegos() {
    return await this.PrismaService.videojuego.count({
      where: {
        estado: true,
      },
    });
  }

  async getCountEvaluacionesHechas() {
    return await this.PrismaService.evaluacion.count({
      where: {
        estado: true,
      },
    });
  }

  async getCountEvaluacionesEsperadas() {}

  async getRanking() {
    const videojuegos = await this.PrismaService.videojuego.findMany({
      where: {
        estado: true,
      },
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

    // Ordenar por notaFinal de mayor a menor (nulls al final)
    const videojuegosOrdenados = videojuegosConNotas.sort((a, b) => {
      if (a.notaFinal === null) return 1;
      if (b.notaFinal === null) return -1;
      return b.notaFinal - a.notaFinal;
    });

    return videojuegosOrdenados;
  }

  async getPromedioGlobal() {
    const videojuegos = await this.PrismaService.videojuego.findMany({
      where: {
        evaluacion: {
          some: {}, // Solo videojuegos con evaluaciones
        },
      },
      include: {
        evaluacion: {
          include: {
            criterio_evaluacion: {
              include: {
                criterio: true,
              },
            },
          },
        },
      },
    });

    const todasLasNotas: number[] = [];

    videojuegos.forEach((videojuego) => {
      videojuego.evaluacion.forEach((evaluacion) => {
        let suma = 0;

        evaluacion.criterio_evaluacion.forEach((criterio_eval) => {
          const porcentaje = criterio_eval.criterio.porcentaje; // ya entre 0 y 1
          const valoracionNum = parseFloat(criterio_eval.valoracion);
          suma += valoracionNum * porcentaje;
        });

        todasLasNotas.push(suma); // Guardamos la nota de esta evaluación individual
      });
    });

    const promedioGeneral =
      todasLasNotas.reduce((a, b) => a + b, 0) / todasLasNotas.length;

    return {
      promedioGeneral: parseFloat(promedioGeneral.toFixed(2)),
    };
  }

  async getSinCalificar() {
    return await this.PrismaService.videojuego.findMany({
      where: {
        evaluacion: {
          none: {}, // Ninguna evaluación asociada
        },
      },
    });
  }

  async getJuradosInactivos() {
    return await this.PrismaService.usuario.findMany({
      where: {
        estado: true,
        usuario_rol: {
          some: {
            id_rol: 2,
            estado: true, // si manejas estado también en la tabla intermedia
          },
        },
        evaluacion: {
          none: {}, // usuarios que NO están en evaluaciones
        },
      },
    });
  }

  async getEquiposRegistroIncompleto() {
    return await this.PrismaService.equipo.findMany({
      where: {
        estado: true,
        id_estado: 1,
      },
    });
  }
}
