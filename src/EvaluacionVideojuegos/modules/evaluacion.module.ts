import { Module } from '@nestjs/common';
import { EvaluacionController } from '../controllers/evaluacion.controller';
import { EvaluacionService } from '../services/evaluacion.services';

@Module({
    controllers: [EvaluacionController],
    providers: [EvaluacionService],
})
export class EvaluacionModule {}