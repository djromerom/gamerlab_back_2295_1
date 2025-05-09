import { Controller, Get, Post, Body, Param, Res, Delete, HttpCode, Req, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { JuradosService } from '../services/jurados.service';
import { CreateJuradoDto } from '../dto/create-jurado.dto';

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
    // Confirma el correo (puedes dejarlo vacío si solo quieres la pantalla)
    // await this.juradosService.confirmEmail(token);

    const templatePath = require('path').join(__dirname, '../views/set-password.html');
    let template = await require('fs').promises.readFile(templatePath, 'utf8');
    
    // Reemplazar las variables en la plantilla
    const isResend = req.query.resend === 'true';
    template = template.replace('{{isResend}}', isResend);
    template = template.replace('{{token}}', token);
    
    return res.send(template);
  }

  @Post('set-password')
  async setPassword(@Body() body: { token: string; password: string; confirmPassword: string }) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    return this.juradosService.setPassword(body.token, body.password);
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