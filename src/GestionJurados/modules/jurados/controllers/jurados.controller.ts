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
  async confirmEmail(
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const templatePath = path.join(__dirname, '..', 'views', 'set-password.html');
      let template = await fs.readFile(templatePath, 'utf8');
      
      // Replace all token placeholders
      template = template.replaceAll('{{token}}', token);
      
       template = template
        .replace('{{#if isResend}}', '')
        .replace('{{/if}}', '')
        .replace('{{#if}}', '')
        .replace('{{/if}}', '');

      
      return res.send(template);
    } catch (error) {
      console.error('Error loading template:', error);
      throw new InternalServerErrorException('Error loading template');
    }
  }

  @Post('set-password')
  async setPassword(
    @Body() body: { token: string; password: string; confirmPassword: string },
    @Res() res: Response
  ) {
    try {
      if (body.password !== body.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      await this.juradosService.setPassword(body.token, body.password);
      
      // Redirect to frontend login page
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