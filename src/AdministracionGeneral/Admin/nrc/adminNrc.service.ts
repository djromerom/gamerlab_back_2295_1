import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminNrcService {
  constructor(private PrismaService: PrismaService) {}
// CRUD de Materias
  async createNrc(data: { id_materia: number, codigo: string, id_usuario: number }) {
    console.log('DATA RECIBIDA:', data);
    return this.PrismaService.nrc.create({
      data: {
        id_materia: data.id_materia,
        codigo: data.codigo,
        id_usuario: data.id_usuario,
        activo: true, // activa por defecto
        estado: true, // activa por defecto
      },
    });
  }

  async getNrcs() {
    const nrcs = await this.PrismaService.nrc.findMany({
      where: {
        estado: true,
      },
    });
    const nrcsConDetalles = await Promise.all(nrcs.map(async (nrc) => {
      const materia = await this.PrismaService.materia.findFirst({
        where: {
          id_materia: nrc.id_materia,
          estado: true,
        }
      });
        if (!materia) {
            throw new NotFoundException(`la materia correspondieente al nrc no existe o está inactiva`);
        }
      const profesor = await this.PrismaService.usuario.findFirst({
        where: {
          id_usuario: nrc.id_usuario,
          estado: true,
        }
      });
        if (!profesor) {
            throw new NotFoundException(`el profesor correspondieente al nrc no existe o está inactivo`);
        }
      return {
        ...nrc,
        materia: materia.nombre,
        profesor: `${profesor.primer_nombre} ${profesor.primer_apellido}`,
      };
    }));
    return nrcsConDetalles;
  }

  async getNrcById(id_nrc: number) {
    const nrc = await this.PrismaService.nrc.findFirst({
      where: {
        id_nrc,
        estado: true,
      },
    });

    if (!nrc) {
      throw new NotFoundException(`nrc con id ${id_nrc} no encontrado o inactivo`);
    }

    const materia = await this.PrismaService.materia.findFirst({
        where: {
            id_materia: nrc.id_materia,
            estado: true,
        }
    });
    if(!materia) {
        throw new NotFoundException(`la materia correspondieente al nrc no existe o está inactiva`);
    }

    const profesor = await this.PrismaService.usuario.findFirst({
        where: {
            id_usuario: nrc.id_usuario,
            estado: true,
        }
    });
    if(!profesor) {
        throw new NotFoundException(`el profesor correspondieente al nrc no existe o está inactivo`);
    }

    return {
        ...nrc,
        materia: materia.nombre,
        profesor: `${profesor.primer_nombre} ${profesor.primer_apellido}`,
    }
  }

  async updateNrc(id_nrc: number, data: { id_materia?: number, codigo?: string, id_usuario?: number }) {
    await this.validarNrcActivo(id_nrc);
  
    return this.PrismaService.nrc.update({
      where: { id_nrc},
      data,
    });
  }
  
  async deleteNrc(id_nrc: number) {
    await this.validarNrcActivo(id_nrc);
  
    return this.PrismaService.nrc.update({
      where: { id_nrc },
      data: { estado: false },
    });
  }

  private async validarNrcActivo(id_nrc: number) {
    const criterio = await this.PrismaService.nrc.findUnique({ where: { id_nrc } });
  
    if (!criterio || !criterio.estado) {
      throw new NotFoundException(`rol con id ${id_nrc} no encontradp o inactivo`);
    }
  
    return criterio;
  }
}
