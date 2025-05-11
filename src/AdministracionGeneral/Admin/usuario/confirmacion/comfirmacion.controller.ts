import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Req, Res } from "@nestjs/common";
import { AdminUsuarioService } from "../adminUsuario.service";
import { Response, Request } from 'express';
import { Public } from 'src/AdministracionGeneral/guards/auth.guard';
import { join } from "path";

@Controller('confirmacion')
export class ConfirmacionController {
  constructor(private readonly adminService: AdminUsuarioService) {}

    @Public()
  @Get(':token')
  async confirmEmail(
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // Confirma el correo (puedes dejarlo vacío si solo quieres la pantalla)
    // await this.juradosService.confirmEmail(token);

    //const templatePath = require('path').join(__dirname, '../views/set-password.html');
    const templatePath = join(process.cwd(), 'src', 'AdministracionGeneral', 'Admin', 'usuario', 'views', 'set-password.html');
    let template = await require('fs').promises.readFile(templatePath, 'utf8');
    
    // Reemplazar las variables en la plantilla
    const isResend = req.query.resend === 'true';
    template = template.replace('{{isResend}}', isResend);
    template = template.replace('{{token}}', token);
    
    return res.send(template);
  }

  @Public()
  @Post('set-password')
  async setPassword(@Body() body: { token: string; password: string; confirmPassword: string }) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    return this.adminService.setPassword(body.token, body.password);
  }

  @Public()
  @Post(':id/reenviar-invitacion')
  @HttpCode(200)
  async reenviarInvitacion(@Param('id') id: string, @Body()body: {id_rol: number}) {
    return this.adminService.reenviarInvitacion(Number(id), body.id_rol);
  }
}