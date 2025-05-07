import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
      },
    });

    if (videojuegos.length === 0) {
      throw new NotFoundException(
        'No se encontraron videojuegos en la base de datos.',
      );
    }

    return videojuegos;
  }

  async getVideojuegoById(id_videojuego: number) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: { id_videojuego },
      select: {
        id_videojuego: true,
        id_equipo: true,
        nombre: true,
        descripcion: true,
      },
    });

    if (!videojuego) {
      throw new NotFoundException(
        `No se encontró el videojuego con ID ${id_videojuego}.`,
      );
    }

    return videojuego;
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
}
