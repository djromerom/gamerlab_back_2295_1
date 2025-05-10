import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AdminUsuarioService } from './adminUsuario.service';
import { Response } from 'express';

// esquema de usuario
interface UsuarioDTO {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido: string;
  confirmado?: boolean;
  token_confirmacion?: string;
  correo: string;
  ultima_conexion?: Date;
  password?: string;
  id_rol: number;
}

@Controller('admin')
export class AdminUsuarioController {
  constructor(private adminService: AdminUsuarioService) {}
  // CRUD de Usuarios
  @Post('createUsuario')
  createUsuario(@Body() data: UsuarioDTO) {
    return this.adminService.createUsuario(data);
  }
  
  @Get('getUsuarios')
  getUsuarios() {
    return this.adminService.getUsuarios();
  }

  @Get('getUsuarioById/:id')
  getUsuarioById(@Param('id') id: string) {
    return this.adminService.getUsuarioById(Number(id));
  }

  @Get('getusuariosByRol/:id')
  getUsuariosByRol(@Param('id') id: string) {
    return this.adminService.getUsuariosByRol(Number(id));
  }
/*
  @Get('getUsuariosByMateria/:id')
  getUsuarioByMateria(@Param('id') id: string) {
    return this.adminService.getUsuarioByMateria(Number(id));
  }

  @Get('getUsuariosByNrc/:id')
  getUsuarioByNrc(@Param('id') id: string) {
    return this.adminService.getUsuarioByNrc(Number(id));
  }

  @Get('getUsuariosByEquipo/:id')
  getUsuarioByEquipo(@Param('id') id: string) {
    return this.adminService.getUsuarioByEquipo(Number(id));
  }
  */

  @Put('updateUsuario/:id')
  updateUsuario(@Param('id') id: string, @Body() data: UsuarioDTO) {
    return this.adminService.updateUsuario(Number(id), data);
  }

  @Delete('deleteUsuario/:id')
  deleteUsuario(@Param('id') id: string) {
    return this.adminService.deleteUsuario(Number(id));
  }

  @Put('addRol/:id')
  addRol(@Param('id') id: string, @Body() data: { id_rol: number }) {
    return this.adminService.addRolToUsuario(Number(id), data.id_rol);
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string, @Res() res: Response) {
    // Confirma el correo (puedes dejarlo vacío si solo quieres la pantalla)
     //await this.adminService.confirmEmail(token);

    // Devuelve un HTML simple para crear la contraseña
    return res.send(`
      <html>
        <body>
          <h2>Crear contraseña</h2>
          <form method="POST" action="/admin/set-password">
            <input type="hidden" name="token" value="${token}" />
            <label>Nueva contraseña:</label>
            <input type="password" name="password" required />
            <button type="submit">Guardar contraseña</button>
          </form>
        </body>
      </html>
    `);
  }

  @Post('set-password')
  async setPassword(@Body() body: { token: string; password: string; confirmPassword: string }) {
  if (body.password !== body.confirmPassword) {
    throw new BadRequestException('Las contraseñas no coinciden');
  }
  
  // Validación de requisitos de contraseña
  const passwordRegex = /^(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&])(?=.{8,})/;
  if (!passwordRegex.test(body.password)) {
    throw new BadRequestException(
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
    );
  }
  
  return this.adminService.setPassword(body.token, body.password);
}
}

