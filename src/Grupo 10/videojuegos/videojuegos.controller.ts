import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, HttpCode, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { VideojuegosService } from './videojuegos.service';
import { CreateVideojuegoDto } from './dto/create-videojuegos.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuegos.dto';

@Controller('videojuegos')
export class VideojuegosController {
  private readonly logger = new Logger(VideojuegosController.name);

  constructor(private readonly videojuegosService: VideojuegosService) {}

  @Post()
  async create(@Body() createVideojuegoDto: CreateVideojuegoDto) {
    try {
      // Validar reCAPTCHA antes de proceder a crear el equipo
      if (!createVideojuegoDto.token_captcha) {
        throw new BadRequestException('Se requiere verificación reCAPTCHA');
      }

      const isHuman = await this.videojuegosService.verifyRecaptchaToken(createVideojuegoDto.token_captcha);
      if (!isHuman) {
        throw new HttpException('Verificación de reCAPTCHA fallida', HttpStatus.FORBIDDEN);
      }
      
      return await this.videojuegosService.create(createVideojuegoDto);
    } catch (error) {
      this.logger.error(`Error al crear videojuego: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error al crear el videojuego',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verify-recaptcha')
  async verifyRecaptcha(@Body() body: { recaptchaToken: string }) {
    this.logger.debug(`Recibida solicitud de verificación de reCAPTCHA con token: ${body.recaptchaToken?.substring(0, 10)}...`);
    
    if (!body.recaptchaToken) {
      throw new BadRequestException('Token de reCAPTCHA no proporcionado');
    }

    try {
      const isValid = await this.videojuegosService.verifyRecaptchaToken(body.recaptchaToken);
      
      return {
        success: isValid,
        message: isValid ? 'Verificación de reCAPTCHA exitosa' : 'Verificación de reCAPTCHA fallida'
      };
    } catch (error) {
      this.logger.error(`Error al verificar el token de reCAPTCHA: ${error.message}`, error.stack);
      throw new BadRequestException('Error al verificar el token de reCAPTCHA');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.videojuegosService.findAll();
    } catch (error) {
      this.logger.error(`Error al obtener videojuegos: ${error.message}`, error.stack);
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
      this.logger.error(`Error al obtener videojuego ${id}: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error al obtener el videojuego',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('confirmar/:id')
  @HttpCode(200)
  async confirmVideojuego(@Param('id') id: string) {
    try {
      const updated = await this.videojuegosService.confirmar(+id);
      if (!updated) {
        throw new NotFoundException('Videojuego no encontrado o ya confirmado');
      }
      return { message: 'Confirmación exitosa', videojuego: updated };
    } catch (error) {
      this.logger.error(`Error al confirmar videojuego ${id}: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error al confirmar el videojuego',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
    
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVideojuegoDto: UpdateVideojuegoDto) {
    try {
      return await this.videojuegosService.update(+id, updateVideojuegoDto);
    } catch (error) {
      this.logger.error(`Error al actualizar videojuego ${id}: ${error.message}`, error.stack);
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
      this.logger.error(`Error al eliminar videojuego ${id}: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error al eliminar el videojuego',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}