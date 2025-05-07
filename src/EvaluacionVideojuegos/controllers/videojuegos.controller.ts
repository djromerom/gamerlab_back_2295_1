import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { VideojuegosService } from '../services/videojuegos.services';

@Controller('videojuegos')
export class VideojuegosController {
constructor(private readonly videojuegosService: VideojuegosService) {}

@Get('getVideojuegos') // Maneja solicitudes GET a /evaluacion_videojuegos
async getAllVideojuegos() {
    return this.videojuegosService.getAllVideojuegos();
}

@Get('getVideojuegoById/:id') // Maneja solicitudes GET a /evaluacion_videojuegos/:id
async getVideojuegoById(@Param('id') id: number) {
    return this.videojuegosService.getVideojuegoById(Number(id));
}

@Get('GetVideoJuegosNoEvaluados/:id_usuario')
async obtenerVideojuegosNoEvaluados(
  @Param('id_usuario') id_usuario: number,
) {
  return this.videojuegosService.getVideojuegosNoEvaluadosPorUsuario(Number(id_usuario));
}

}