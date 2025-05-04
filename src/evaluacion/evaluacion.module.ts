// src/evaluaciones/evaluaciones.module.ts
import { Module } from '@nestjs/common';
import { EvaluacionController } from './evaluacion.controller';
import { EvaluacionService } from './evaluacion.service';
import { PrismaModule } from '../prisma/prisma.module'; // << IMPORTANTE

@Module({
  imports: [PrismaModule], // << Asegúrate de tener esto
  controllers: [EvaluacionController],
  providers: [EvaluacionService],
})
export class EvaluacionModule {}
