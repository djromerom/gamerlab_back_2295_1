import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { integrante } from '@prisma/client'; 
import { CreateIntegranteDto } from './dto/create-integrante.dto';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

  async create(createIntegranteDto: CreateIntegranteDto): Promise<integrante> {
    try {
      // validacion de usuario git y correo uninorte ----
      const nuevoIntegrante = await this.prisma.integrante.create({
        data: createIntegranteDto, 
      });

      return nuevoIntegrante; 

    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el integrante.', error.message);
    }
  }

  async findAll(): Promise<integrante[]> {
    try {
      const integrantes = await this.prisma.integrante.findMany();
      return integrantes;
    } catch (error) {
       throw new InternalServerErrorException('No se pudieron obtener los integrantes.', error);
    }
  }

  async findOne(id: number): Promise<integrante | null> {
    const integrante = await this.prisma.integrante.findUnique({
      where: { id_integrante: id },
    });
    if (!integrante) {
      throw new NotFoundException(`Integrante con ID ${id} no encontrado.`);
    }
    return integrante;
  }
}