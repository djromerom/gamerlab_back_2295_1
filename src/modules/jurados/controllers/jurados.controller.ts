import { Controller, Get, Post, Body, Param, Res, Delete, HttpCode, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Response, Request } from 'express';
import { JuradosService } from '../services/jurados.service';
import { CreateJuradoDto } from '../dto/create-jurado.dto';
import * as path from 'path';
import { promises as fs } from 'fs';

@Controller('jurados')
export class JuradosController {
  constructor(private readonly juradosService: JuradosService) {}

  @Post()
  create(@Body() createJuradoDto: CreateJuradoDto) {
    return this.juradosService.create(createJuradoDto);
  }

  @Get()
  findAll() {
    return this.juradosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.juradosService.findOne(+id);
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      const templatePath = path.join(__dirname, '..', 'views', 'set-password.html');
      let template = await fs.readFile(templatePath, 'utf8');
      template = template.replaceAll('{{token}}', token);
      return res.send(template);
    } catch (error) {
      throw new BadRequestException('Error al cargar la página de confirmación');
    }
  }

  @Post('set-password')
  async setPassword(
    @Body() body: { token: string; password: string; confirmPassword: string },
    @Res() res: Response
  ) {
    try {
      if (!body.token) {
        throw new BadRequestException('Token requerido');
      }

      if (body.password !== body.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(body.password)) {
        throw new BadRequestException('La contraseña no cumple con los requisitos mínimos');
      }

      await this.juradosService.setPassword(body.token, body.password);
      return res.redirect('http://localhost:5173/login');
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/reenviar-invitacion')
  @HttpCode(200)
  async reenviarInvitacion(@Param('id') id: string) {
    return this.juradosService.reenviarInvitacion(Number(id));
  }

  @Delete(':id')
  async eliminarJurado(@Param('id') id: string) {
    return this.juradosService.eliminarJurado(Number(id));
  }
}