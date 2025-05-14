import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { materia as FrontendMateriaInterface, nrc as FrontendNrcInterface } from '@prisma/client'; 


@Injectable()
export class AdminMateriaService {
  constructor(private prismaService: PrismaService) {}

  async createMateria(data: { nombre: string; codigo: string }) {
    console.log('DATA RECIBIDA:', data);
    return this.prismaService.materia.create({ // Usa prismaService, no PrismaService
      data: {
        nombre: data.nombre,
        codigo: data.codigo,
        estado: true, // activa por defecto
      },
    });
  }

   async getMaterias() {
     try {
        const materias = await this.prismaService.materia.findMany({ 
          where: {
            estado: true,
          },
        });
        return materias; 
     } catch (error) {
         console.error('Error getting materias:', error);
         throw new InternalServerErrorException('Failed to fetch materias.');
     }
   }


  async getMateriaById(id_materia: number) {
     if (isNaN(id_materia) || id_materia <= 0) {
          throw new BadRequestException('ID de materia inválido.');
      }
    const materia = await this.prismaService.materia.findFirst({ 
      where: {
        id_materia,
        estado: true,
      },
    });

    if (!materia) {
      throw new NotFoundException(`Materia con id ${id_materia} no encontrada o inactiva`);
    }

    return materia; 
  }

  async updateMateria(id_materia: number, data: { nombre?: string; codigo?: string }) {
    await this.validarMateriaActiva(id_materia);

    return this.prismaService.materia.update({ 
      where: { id_materia },
      data,
    });
  }

  async deleteMateria(id_materia: number) {
    await this.validarMateriaActiva(id_materia);

    return this.prismaService.materia.update({
      where: { id_materia },
      data: { estado: false },
    });
  }

  private async validarMateriaActiva(id_materia: number) {
     if (isNaN(id_materia) || id_materia <= 0) {
          throw new BadRequestException('ID de materia inválido para validación.');
     }
    const materia = await this.prismaService.materia.findUnique({ where: { id_materia } }); 
    if (!materia || !materia.estado) {
      throw new NotFoundException(`Materia con id ${id_materia} no encontrada o inactiva`);
    }

    return materia; 
  }


  
}