import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateIntegranteDto } from './dto/create-integrante.dto';
import { CreateIntegranteNrcDto } from './dto/create-integrante-nrc.dto';
import { integrante } from '@prisma/client'

@Controller('estudiantes') // http://localhost:3000/estudiantes
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post() // crear estudiantes
  async create(@Body() createIntegranteDto: CreateIntegranteDto): Promise<integrante> {
    return this.estudiantesService.create(createIntegranteDto);
  }

  @Post('nrc')
  createIntegranteNrc(@Body() dto: CreateIntegranteNrcDto) {
    return this.estudiantesService.createIntegranteNrc(dto);
  }

  @Get() // obtener estudiantes
  async findAll(): Promise<integrante[]> {
    return this.estudiantesService.findAll();
  }

  @Get(':id') // obtener estudiante por ID: http://localhost:3000/estudiantes/id
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<integrante | null> {
    return this.estudiantesService.findOne(id);
  }
}