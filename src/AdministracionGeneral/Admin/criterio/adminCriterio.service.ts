import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminCriterioService {
  constructor(private PrismaService: PrismaService) {}
// CRUD de Materias
  async createCriterio(data: { nombre: string, descripcion: string, porcentaje: number }) {
    console.log('DATA RECIBIDA:', data);
    return this.PrismaService.criterio.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        porcentaje: data.porcentaje,
        estado: true, // activa por defecto
      },
    });
  }

  async getCriterios() {
    return this.PrismaService.criterio.findMany({
      where: {
        estado: true,
      },
    });
  }

  async getCriterioById(id_criterio: number) {
    const rol = await this.PrismaService.criterio.findFirst({
      where: {
        id_criterio,
        estado: true,
      },
    });

    if (!rol) {
      throw new NotFoundException(`rol con id ${id_criterio} no encontrado o inactivo`);
    }

    return rol;
  }

  async updateCriterio(id_criterio: number, data: { nombre?: string, descripcion?: string, porcentaje?: number }) {
    await this.validarCriterioActivo(id_criterio);
  
    return this.PrismaService.criterio.update({
      where: { id_criterio },
      data,
    });
  }
  
  async deleteCriterio(id_criterio: number) {
    await this.validarCriterioActivo(id_criterio);
  
    return this.PrismaService.criterio.update({
      where: { id_criterio },
      data: { estado: false },
    });
  }

  private async validarCriterioActivo(id_criterio: number) {
    const criterio = await this.PrismaService.criterio.findUnique({ where: { id_criterio } });
  
    if (!criterio || !criterio.estado) {
      throw new NotFoundException(`rol con id ${id_criterio} no encontradp o inactivo`);
    }
  
    return criterio;
  }
}
