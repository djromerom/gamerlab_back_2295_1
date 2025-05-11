// src/evaluaciones/evaluaciones.module.ts
import { Module } from '@nestjs/common';
import { EvaluacionController } from './controllers/evaluacion.controller';
import { EvaluacionService } from './services/evaluacion.service';
import { PrismaModule } from '../../../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [EvaluacionController],
  providers: [EvaluacionService],
})
export class EvaluacionJuradosModule {} 
