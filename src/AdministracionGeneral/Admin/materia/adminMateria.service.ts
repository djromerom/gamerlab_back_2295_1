import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminMateriaService {
  constructor(private PrismaService: PrismaService) {}
  // CRUD de Materias
  async createMateria(data: { nombre: string; codigo: string }) {
    console.log('DATA RECIBIDA:', data);
    return this.PrismaService.materia.create({
      data: {
        nombre: data.nombre,
        codigo: data.codigo,
        estado: true, // activa por defecto
      },
    });
  }

  async getMaterias() {
    console.log(
      await this.PrismaService.materia.findMany({
        where: {
          estado: true,
        },
        include: {
          nrc: {
            where: {
              estado: true,
            },
            include: {
              usuario: {
                select: {
                  primer_nombre: true,
                  primer_apellido: true,
                },
              },
            },
          },
        },
      }),
    );
    return this.PrismaService.materia.findMany({
      where: {
        estado: true,
      },
      include: {
        nrc: {
          where: {
            estado: true,
          },
          include: {
            usuario: {
              select: {
                primer_nombre: true,
                segundo_nombre: true,
                primer_apellido: true,
                segundo_apellido: true,
              },
            },
          },
        },
      },
    });
  }

  async getMateriaById(id_materia: number) {
    const materia = await this.PrismaService.materia.findFirst({
      where: {
        id_materia,
        estado: true,
      },
    });

    if (!materia) {
      throw new NotFoundException(
        `Materia con id ${id_materia} no encontrada o inactiva`,
      );
    }

    return materia;
  }

  async updateMateria(
    id_materia: number,
    data: { nombre?: string; codigo?: string },
  ) {
    await this.validarMateriaActiva(id_materia);

    return this.PrismaService.materia.update({
      where: { id_materia },
      data,
    });
  }

  async deleteMateria(id_materia: number) {
    await this.validarMateriaActiva(id_materia);

    return this.PrismaService.materia.update({
      where: { id_materia },
      data: { estado: false },
    });
  }

  private async validarMateriaActiva(id_materia: number) {
    const materia = await this.PrismaService.materia.findUnique({
      where: { id_materia },
    });

    if (!materia || !materia.estado) {
      throw new NotFoundException(
        `Materia con id ${id_materia} no encontrada o inactiva`,
      );
    }

    return materia;
  }
}
