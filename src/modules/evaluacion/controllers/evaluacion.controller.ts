import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get('usuario/:idUsuario')
  async getEvaluacionesByUsuario(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.evaluacionService.getEvaluacionesByUsuario(idUsuario);
  }
}
