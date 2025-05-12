import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { VideojuegosService } from '../services/videojuegos.services';

@Controller('videojuegos')
export class VideojuegosController {
constructor(private readonly videojuegosService: VideojuegosService) {}

@Get('getVideojuegos/:id_usuario')
async getAllVideojuegosByUsuario(@Param('id_usuario') id_usuario: number) {
    return this.videojuegosService.getAllVideojuegosByUsuario(Number(id_usuario));
}

@Get('GetVideoJuegosNoEvaluados/:id_usuario')
async obtenerVideojuegosNoEvaluados(
  @Param('id_usuario') id_usuario: number,
) {
  return this.videojuegosService.getVideojuegosNoEvaluadosPorUsuario(Number(id_usuario));
}

@Get('getVideojuegoById/:id_videojuego/:id_usuario')
async getVideojuegoById(
  @Param('id_videojuego') id_videojuego: number,
  @Param('id_usuario') id_usuario: number,
) {
  return this.videojuegosService.getVideojuegoById(Number(id_videojuego), Number(id_usuario));
}

}
