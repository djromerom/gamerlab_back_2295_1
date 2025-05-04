import { Controller, Get, Delete, Param, Post, HttpCode } from '@nestjs/common';
import { JuradosService } from './jurados.service';

@Controller('jurados')
export class JuradosController {
  constructor(private readonly juradosService: JuradosService) {}

  @Get()
  getJurados() {
    return this.juradosService.obtenerJurados();
  }

  @Delete(':id')
  deleteJurado(@Param('id') id: string) {
    return this.juradosService.eliminarJurado(Number(id));
  }

  @Post(':id/reenviar-invitacion')
  @HttpCode(200)
  reenviarCorreo(@Param('id') id: string) {
    return this.juradosService.reenviarInvitacion(Number(id));
  }
}
