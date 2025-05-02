import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VideojuegosService } from './videojuegos.service';
import { CreateVideojuegoDto } from './dto/create-videojuego.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuego.dto';

@Controller('videojuegos')
export class VideojuegosController {
  constructor(private readonly videojuegosService: VideojuegosService) {}

  @Post()
  create(@Body() createVideojuegoDto: CreateVideojuegoDto) {
    return this.videojuegosService.create(createVideojuegoDto);
  }

  @Get()
  findAll() {
    return this.videojuegosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videojuegosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideojuegoDto: UpdateVideojuegoDto) {
    return this.videojuegosService.update(+id, updateVideojuegoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videojuegosService.remove(+id);
  }
}
