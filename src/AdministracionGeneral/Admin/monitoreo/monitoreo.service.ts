import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MonitoreoService {
    constructor(private PrismaService: PrismaService) { }

    async getCountEquipos() {
        return await this.PrismaService.equipo.count({
            where: {
                estado: true,
                id_estado: 2
            }
        });
    }

    async getCountVideojuegos() {
        return await this.PrismaService.videojuego.count({
            where: {
                estado: true,
            }
        });
    }

    async getCountEvaluacionesHechas() {
        return await this.PrismaService.evaluacion.count({
            where: {
                estado: true,
            }
        });
    }

    async getCountEvaluacionesEsperadas() {

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
                none: {} // Ninguna evaluación asociada
            }
        }
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
                id_estado: 1
            }
        });
    }
}