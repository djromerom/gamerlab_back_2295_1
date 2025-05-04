import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVideojuegoDto } from './dto/create-videojuegos.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuegos.dto';

@Injectable()
export class VideojuegosService {
  constructor(private prisma: PrismaService) {}

  async create(createVideojuegoDto: CreateVideojuegoDto) {
    const equipo = await this.prisma.equipo.findUnique({
      where: { id_equipo: createVideojuegoDto.id_equipo },
    });
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${createVideojuegoDto.id_equipo} no encontrado`);
    }
    if (createVideojuegoDto.descripcion && createVideojuegoDto.descripcion.length > 300) {
      throw new NotFoundException('La descripción no puede exceder los 300 caracteres.');
    }
    return this.prisma.videojuego.create({
      data: {
        ...createVideojuegoDto,
        fecha_creacion: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.videojuego.findMany({
      include: {
        equipo: true,
      },
    });
  }

  async findOne(id: number) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: { id_videojuego: id },
      include: {
        equipo: true,
      },
    });

    if (!videojuego) {
      throw new NotFoundException(`Videojuego con ID ${id} no encontrado`);
    }

    return videojuego;
  }

  async update(id: number, updateVideojuegoDto: UpdateVideojuegoDto) {
    await this.findOne(id);

    // Si se actualiza el id_equipo, verificar que existe
    if (updateVideojuegoDto.id_equipo) {
      const equipo = await this.prisma.equipo.findUnique({
        where: { id_equipo: updateVideojuegoDto.id_equipo },
      });

      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${updateVideojuegoDto.id_equipo} no encontrado`);
      }
    }
    if (updateVideojuegoDto.descripcion && updateVideojuegoDto.descripcion.length > 300) {
      throw new NotFoundException('La descripción no puede exceder los 300 caracteres.');
    }

    return this.prisma.videojuego.update({
      where: { id_videojuego: id },
      data: {
        ...updateVideojuegoDto,
        fecha_actualizacion: new Date(),
      },
    });
  }

  async remove(id: number) {
    // Verificar si existe el videojuego
    await this.findOne(id);

    return this.prisma.videojuego.delete({
      where: { id_videojuego: id },
    });
  }
}