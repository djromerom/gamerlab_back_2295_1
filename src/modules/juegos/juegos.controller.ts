import { Controller, Get, Query } from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('juegos')
export class JuegosController {
  constructor(
    private readonly juegosService: JuegosService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  async getJuegos(
    @Query('search') search?: string,
    @Query('materia') materia?: string,
    @Query('order') order?: string,
  ) {
    return this.juegosService.getJuegos({ search, materia, order });
  }

  @Get('/materias')
  async getMaterias() {
    // Devuelve todas las materias activas
    return this.prisma.materia.findMany({
      where: { estado: true },
      select: { codigo: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }
} 