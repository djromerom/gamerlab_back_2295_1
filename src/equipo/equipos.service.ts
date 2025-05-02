import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { equipo } from '@prisma/client'; 
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquiposService {
  constructor(private prisma: PrismaService) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<equipo> {
    try {
      const nuevoEquipo = await this.prisma.equipo.create({
        data: createEquipoDto,
      });
      return nuevoEquipo;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el equipo.');
    }
  }

  async findAll(): Promise<equipo[]> {
    try {
      const equipos = await this.prisma.equipo.findMany();
      return equipos;
    } catch (error) {
      throw new InternalServerErrorException('No se pudieron obtener los equipos.');
    }
  }

  async findOne(id: number): Promise<equipo | null> {
    const equipoEncontrado = await this.prisma.equipo.findUnique({
      where: { id_equipo: id },
    });
    if (!equipoEncontrado) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado.`);
    }
    return equipoEncontrado;
  }


  async update(id: number, updateEquipoDto: UpdateEquipoDto): Promise<equipo> {
    try {
      const equipoActualizado = await this.prisma.equipo.update({
        where: { id_equipo: id },
        data: updateEquipoDto,
      });
      return equipoActualizado;
    } catch (error) {
       // Prisma lanza P2025 si el registro a actualizar no existe (Not Found)
       if (error.code === 'P2025') {
           throw new NotFoundException(`Equipo con ID ${id} no encontrado para actualizar.`);
       }
      throw new InternalServerErrorException('No se pudo actualizar el equipo.');
    }
  }

  async remove(id: number): Promise<equipo> {
    try {
      const equipoEliminado = await this.prisma.equipo.delete({
        where: { id_equipo: id },
      });
      return equipoEliminado;
    } catch (error) {
       if (error.code === 'P2025') {
           throw new NotFoundException(`Equipo con ID ${id} no encontrado para eliminar.`);
       }
      throw new InternalServerErrorException('No se pudo eliminar el equipo.');
    }
  }
}