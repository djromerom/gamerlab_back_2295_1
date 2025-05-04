import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe,HttpException, HttpStatus } from '@nestjs/common'; // Importa los decoradores necesarios
import { EquiposService } from './equipos.service'; 
import { CreateEquipoDto } from './dto/create-equipo.dto'; 
import { UpdateEquipoDto } from './dto/update-equipo.dto'; 
import { equipo } from '@prisma/client'; 

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}
  
    @Post()
    async create(@Body() createEquipoDto: CreateEquipoDto): Promise<equipo> {
      // Validar si ya existe un equipo con el mismo nombre
      const existingTeam = await this.equiposService.findByName(createEquipoDto.nombre);
      if (existingTeam) {
        throw new HttpException('Team with this name already exists', HttpStatus.CONFLICT);
      }
  
  
  
      // Crear el equipo después de todas las validaciones
      return this.equiposService.create(createEquipoDto);
    }
  
  @Get()
  async findAll(): Promise<equipo[]> {
    return this.equiposService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<equipo | null> {
    return this.equiposService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateEquipoDto: UpdateEquipoDto): Promise<equipo> {
    return this.equiposService.update(id, updateEquipoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<equipo> {
    return this.equiposService.remove(id);
  }
}