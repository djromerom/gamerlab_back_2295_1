import { Controller, Post, Param, Body, Get, Delete, Put } from '@nestjs/common';
import { EvaluacionService } from '../services/evaluacion.services';


@Controller('evaluacion') // Ruta base: /evaluacion
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

@Post('createEvaluacion') // Maneja solicitudes POST a /evaluacion/createEvaluacion
  async createEvaluacion(
    @Body()
    body: {
      id_usuario: number;
      id_videojuego: number;
      criterios: { id_criterio: number; valoracion: string }[];
      comentario: string;
    },
  ) {
    const { id_usuario, id_videojuego, criterios, comentario } = body;
    return this.evaluacionService.createEvaluacion(
      Number(id_usuario),
      Number(id_videojuego),
      criterios,
      comentario,
    );
}

@Get('getEvaluacionesByUsuario/:idUsuario') // Maneja solicitudes GET a /evaluacion/usuario/:idUsuario
  async getEvaluacionesByUsuario(@Param('idUsuario') idUsuario: number) {
    return this.evaluacionService.getEvaluacionesByUsuario(Number(idUsuario));
}



/*@Delete('DeleteEvaluacionById/:id') // Maneja solicitudes DELETE a /evaluacion/:id
  async deleteEvaluacionById(@Param('id') idEvaluacion: number) {
    return this.evaluacionService.deleteEvaluacionById(Number(idEvaluacion));
}

@Put('putEvaluacionById') // Maneja solicitudes PUT a /evaluacion/:id
  async updateEvaluacion(
    @Body()
    body: {
      idEvaluacion: number;
      comentario: string;
      criterios: { id_criterio: number; valoracion: string }[];
    },
  ) {
    const {idEvaluacion, comentario, criterios } = body;
    return this.evaluacionService.updateEvaluacion(
      Number(idEvaluacion),
      comentario,
      criterios,
    );
  }
  */
}
