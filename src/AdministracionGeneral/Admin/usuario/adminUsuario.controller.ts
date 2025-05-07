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

// esquema de usuario
interface UsuarioDTO {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido: string;
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
  /*
  @Get('getUsuarios')
  getUsuarios() {
    return this.adminService.getUsuarios();
  }

  @Get('getUsuarioById/:id')
  getUsuarioById(@Param('id') id: string) {
    return this.adminService.getUsuarioById(Number(id));
  }

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

  @Put('updateUsuario/:id')
  updateUsuario(@Param('id') id: string, @Body() data: UsuarioDTO) {
    return this.adminService.updateUsuario(Number(id), data);
  }

  @Delete('deleteUsuario/:id')
  deleteUsuario(@Param('id') id: string) {
    return this.adminService.deleteUsuario(Number(id));
  }
}
*/
}
