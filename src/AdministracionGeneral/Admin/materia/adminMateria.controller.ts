import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AdminMateriaService } from "./adminMateria.service";

//esquema de la materia
interface MateriaDTO {
    nombre: string;
    codigo: string;
}

@Controller('admin')
export class AdminMateriaController {
    constructor(private adminService: AdminMateriaService) { }
    //CRUD de materias
    @Post('createMateria')
    createMateria(@Body() data: MateriaDTO) {
        return this.adminService.createMateria(data);
    }

    @Get("getMaterias")
    getMateria() {
        return this.adminService.getMaterias();
    }

    @Get("getMateriaById/:id")
    getMateriaById(@Param('id') id: string) {
        return this.adminService.getMateriaById(Number(id));
    }

    @Put("updateMateria/:id")
    pdateMateria(@Param('id') id: string, @Body() data: MateriaDTO) {
        return this.adminService.updateMateria(Number(id), data);
    }


    @Delete("deleteMateria/:id")
    deleteMateria(@Param('id') id: string) {
        return this.adminService.deleteMateria(Number(id));
    }
}