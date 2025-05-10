import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { integrante } from '@prisma/client'; 
import { integrante_nrc } from '@prisma/client'; 
import { CreateIntegranteDto } from './dto/create-integrante.dto';
import { CreateIntegranteNrcDto } from './dto/create-integrante-nrc.dto';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

async create(createIntegranteDto: CreateIntegranteDto): Promise<integrante> {
    const { nrcIds, ...integranteData } = createIntegranteDto;
    try {
      const nuevoIntegrante = await this.prisma.integrante.create({
        data: {
          ...integranteData,
          integrante_nrc: nrcIds?.length
            ? {
                create: nrcIds.map(id_nrc => ({
                  nrc: { connect: { id_nrc } },
                  estado: true,    
                })),
              }
            : undefined,
        },
      });
      return nuevoIntegrante;
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo crear el integrante.',
        error.message,
      );
    }
  }

  async createIntegranteNrc(
    dto: CreateIntegranteNrcDto,
  ): Promise<integrante_nrc> {
    try {
      return await this.prisma.integrante_nrc.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo crear el registro integrante_nrc.',
        error.message,
      );
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