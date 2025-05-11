import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminUsuarioService } from './adminUsuario.service';
import { Public } from 'src/AdministracionGeneral/guards/auth.guard';

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
@Public()
@Controller('admin')
export class AdminUsuarioController {
  constructor(private adminService: AdminUsuarioService) {}
  // CRUD de Usuarios
  @Public()
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

  @Put('updateUsuario/:id')
  updateUsuario(@Param('id') id: string, @Body() data: UsuarioDTO) {
    return this.adminService.updateUsuario(Number(id), data);
  }

  @Delete('deleteUsuario/:id')
  deleteUsuario(@Param('id') id: string, @Body() data: { id_rol: number}) {
    return this.adminService.deleteUsuario(Number(id), data.id_rol);
  }

  @Put('addRol/:id')
  addRol(@Param('id') id: string, @Body() data: { id_rol: number }) {
    return this.adminService.addRolToUsuario(Number(id), data.id_rol);
  }

}
