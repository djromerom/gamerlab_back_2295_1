import { Controller, Post, Param, Body, Get, Delete, Put } from '@nestjs/common';
import { EvaluacionService } from '../services/evaluacion.services';

import { Public } from 'src/AdministracionGeneral/guards/auth.guard';
@Public()
@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

@Post('createEvaluacion') 
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

@Get('getEvaluacionesByUsuario/:idUsuario')
  async getEvaluacionesByUsuario(@Param('idUsuario') idUsuario: number) {
    return this.evaluacionService.getEvaluacionesByUsuario(Number(idUsuario));
}

@Get('getEvaluacionByVideojuegoAndUsuario/:id_videojuego/:id_usuario')
  async getEvaluacionByVideojuegoAndUsuario(
    @Param('id_videojuego') id_videojuego: number,
    @Param('id_usuario') id_usuario: number,
  ) {
    return this.evaluacionService.getEvaluacionByVideojuegoAndUsuario(
      Number(id_videojuego),
      Number(id_usuario),
    );
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
