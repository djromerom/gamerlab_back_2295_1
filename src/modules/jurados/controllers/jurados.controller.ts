import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { JuradosService } from '../services/jurados.service';
import { CreateJuradoDto } from '../dto/create-jurado.dto';

@Controller('jurados')
export class JuradosController {
  constructor(private readonly juradosService: JuradosService) {}

  @Post()
  create(@Body() createJuradoDto: CreateJuradoDto) {
    return this.juradosService.create(createJuradoDto);
  }

  @Get()
  findAll() {
    return this.juradosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.juradosService.findOne(+id);
  }

  @Get('confirm/:token')
  confirmEmail(@Param('token') token: string) {
    return this.juradosService.confirmEmail(token);
  }

  @Get()
  getJurados() {
    return this.juradosService.obtenerJurados();
  }

  @Delete(':id')
  deleteJurado(@Param('id') id: string) {
    return this.juradosService.eliminarJurado(Number(id));
  }
}
