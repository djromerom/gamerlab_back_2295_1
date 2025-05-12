import { Controller, Get } from '@nestjs/common';
import { CriteriosService } from '../services/criterios.services';

@Controller('criterios')
export class CriteriosController {
constructor(private readonly criteriosService: CriteriosService) {}

@Get('getCriterios')
async getAllCriterios() {
    return this.criteriosService.getAllCriterios();
}
}
