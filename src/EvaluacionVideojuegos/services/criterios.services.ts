import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CriteriosService {
  constructor(private prisma: PrismaService) {}

  async getAllCriterios() {
    const criterios = await this.prisma.criterio.findMany({
      where: {estado: true},
      select: {
        id_criterio: true,
        nombre: true,
        descripcion: true,
      },
    });

    if (criterios.length === 0) {
      throw new NotFoundException(
        'No se encontraron criterios en la base de datos.',
      );
    }

    return criterios;
  }
}
