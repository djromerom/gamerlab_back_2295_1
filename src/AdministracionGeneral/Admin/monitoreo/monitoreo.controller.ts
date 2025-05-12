import { Controller, Get } from "@nestjs/common";
import { MonitoreoService } from "./monitoreo.service";

@Controller('monitoreo')
export class MonitoreoController {

    constructor(private monitoreoService: MonitoreoService) { }

    @Get('countEquipos')
    getCountEquipos(){
        return this.monitoreoService.getCountEquipos();
    }
    
    @Get('countVideojuegos')
    getCountVideojuegos(){
        return this.monitoreoService.getCountVideojuegos();
    }

    @Get('countEvaluacionesHechas')
    getCountEvaluacionesHechas(){
        return this.monitoreoService.getCountEvaluacionesHechas();
    }

    @Get('promediosGlobales')
    getPromedioGlobal(){
        return this.monitoreoService.getPromedioGlobal();
    }

    @Get('ranking')
    getRanking(){

    }

    @Get('sinCalificar')
    getSinJuegosSinCalificar(){
        return this.monitoreoService.getSinCalificar();
    }

    @Get('juradosInactivos')
    getJuradosInactivos(){
        return this.monitoreoService.getJuradosInactivos();
    }

    @Get('equiposRegistroIncompleto')
    getEquiposRegistroIncompleto(){
        return this.monitoreoService.getEquiposRegistroIncompleto();
    }
}