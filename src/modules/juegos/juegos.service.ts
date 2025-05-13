import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface JuegosQuery {
  search?: string;
  materia?: string;
  order?: string;
}

@Injectable()
export class JuegosService {
  constructor(private readonly prisma: PrismaService) {}

  async getJuegos(query: JuegosQuery) {
    const { search, materia, order } = query;

    // Construir filtros dinámicos
    const where: any = {
      estado: true,
      equipo: { estado: true },
    };
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { equipo: { nombre: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (materia) {
      where.equipo = {
        ...where.equipo,
        integrante: {
          some: {
            integrante_nrc: {
              some: {
                nrc: {
                  materia: { codigo: materia },
                },
              },
            },
          },
        },
      };
    }

    // Orden
    let orderBy: any = {};
    if (order === 'a-z') orderBy = { nombre: 'asc' };
    else if (order === 'z-a') orderBy = { nombre: 'desc' };
    else if (order === 'calificacion') orderBy = { _relevance: { fields: ['nombre'], search: '', sort: 'asc' } }; // Placeholder

    // Consulta principal
    const juegos = await this.prisma.videojuego.findMany({
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      include: {
        equipo: {
          select: {
            nombre: true
          }
        },
        evaluacion: true,
      },
    });

    // Mapear resultados
    return juegos.map(juego => {
      // Calcular promedio de calificación (simulado: cuenta evaluaciones con comentario y pone 5 estrellas si hay comentario, 4 si no)
      let calificacion: number | null = null;
      if (juego.evaluacion.length > 0) {
        // Aquí podrías calcular un promedio real si tienes un campo numérico
        calificacion = Math.round(
          (juego.evaluacion.filter(e => e.comentario).length / juego.evaluacion.length) * 5
        );
      }
      return {
        logo: juego.nombre + ' logo',
        nombreEquipo: juego.equipo.nombre,
        nombreJuego: juego.nombre,
        materia: 'MATXXX', // Puedes mejorar esto si tienes la relación
        calificacion,
      };
    });
  }
} 