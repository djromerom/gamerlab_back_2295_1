import { Controller, Get, Param, ParseIntPipe, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EvaluacionService } from '../services/evaluacion.service';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get('usuario/:idUsuario')
  async getEvaluacionesByUsuario(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    try {
      const evaluaciones = await this.evaluacionService.getEvaluacionesByUsuario(idUsuario);
      
      if (!evaluaciones || evaluaciones.length === 0) {
        throw new NotFoundException(`No se encontraron evaluaciones para el usuario ${idUsuario}`);
      }

      return evaluaciones;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener las evaluaciones');
    }
  }
}
