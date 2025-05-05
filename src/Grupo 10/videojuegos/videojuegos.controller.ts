import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, HttpCode, NotFoundException  } from '@nestjs/common';
import { VideojuegosService } from './videojuegos.service';
import { CreateVideojuegoDto } from './dto/create-videojuegos.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuegos.dto';

@Controller('videojuegos')
export class VideojuegosController {
  constructor(private readonly videojuegosService: VideojuegosService) {}

  @Post()
  async create(@Body() createVideojuegoDto: CreateVideojuegoDto) {
    try {
      // Validar reCAPTCHA antes de proceder a crear el equipo
      const isHuman = await this.videojuegosService.verifyRecaptchaToken(createVideojuegoDto.token_captcha);
      if (!isHuman) {
        throw new HttpException('Failed reCAPTCHA verification', HttpStatus.FORBIDDEN);
      }
      return await this.videojuegosService.create(createVideojuegoDto);

    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear el videojuego',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.videojuegosService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener los videojuegos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const videojuego = await this.videojuegosService.findOne(+id);
      if (!videojuego) {
        throw new HttpException('Videojuego no encontrado', HttpStatus.NOT_FOUND);
      }
      return videojuego;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener el videojuego',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('confirmar/:id')
  @HttpCode(200)
  async confirmVideojuego(@Param('id') id: string) {
    const updated = await this.videojuegosService.confirmar(+id);
    if (!updated) {
      throw new NotFoundException('Videojuego no encontrado o ya confirmado');
    }
    return { message: 'Confirmación exitosa', videojuego: updated };
  }
  

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVideojuegoDto: UpdateVideojuegoDto) {
    try {
      return await this.videojuegosService.update(+id, updateVideojuegoDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar el videojuego',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.videojuegosService.remove(+id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al eliminar el videojuego',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}