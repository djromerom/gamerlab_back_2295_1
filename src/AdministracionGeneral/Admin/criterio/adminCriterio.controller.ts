import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AdminCriterioService } from "./adminCriterio.service";


//esquema del rol
interface CriterioDTO {
    nombre: string,
    descripcion: string,
    porcentaje: number,
}

@Controller('admin')
export class AdminCriterioController {
    constructor(private adminService: AdminCriterioService) { }
    //CRUD de materias
    @Post('createCriterio')
    createCriterio(@Body() data: CriterioDTO) {
        return this.adminService.createCriterio(data);
    }

    @Get("getCriterios")
    getCriterio() {
        return this.adminService.getCriterios();
    }

    @Get("getCriterioById/:id")
    getMateriaById(@Param('id') id: string) {
        return this.adminService.getCriterioById(Number(id));
    }

    @Put("updateCriterio/:id")
    pdateMateria(@Param('id') id: string, @Body() data: CriterioDTO) {
        return this.adminService.updateCriterio(Number(id), data);
    }


    @Delete("deleteCriterio/:id")
    deleteMateria(@Param('id') id: string) {
        return this.adminService.deleteCriterio(Number(id));
    }
}