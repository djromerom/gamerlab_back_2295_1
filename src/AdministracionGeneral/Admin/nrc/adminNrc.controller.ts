import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminNrcService } from './adminNrc.service';
import { Public } from 'src/AdministracionGeneral/guards/auth.guard';

// esquema de nrc
interface NrcDTO {
  id_materia: number;
  codigo: string;
  id_usuario: number;
}
@Public()
@Controller('admin')
export class AdminNrcController {
  constructor(private adminService: AdminNrcService) {}
  //CRUD de materias
  @Post('createNrc')
  createNrc(@Body() data: NrcDTO) {
    return this.adminService.createNrc(data);
  }

  @Get('getNrcs')
  getNrcs() {
    return this.adminService.getNrcs();
  }

  @Get('getNrcById/:id')
  getNrcById(@Param('id') id: string) {
    return this.adminService.getNrcById(Number(id));
  }

  @Get('getNrcByMateria/:id')
  getNrcByMateria(@Param('id') id: string) {
    return this.adminService.getNrcByMateria(Number(id));
  }

  @Put('updateNrc/:id')
  updateNrc(@Param('id') id: string, @Body() data: NrcDTO) {
    return this.adminService.updateNrc(Number(id), data);
  }

  @Delete('deleteNrc/:id')
  deleteMateria(@Param('id') id: string) {
    return this.adminService.deleteNrc(Number(id));
  }
}
