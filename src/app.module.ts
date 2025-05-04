import { Module } from '@nestjs/common';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { PrismaModule } from './prisma/prisma.module';
import { JuradosModule } from './jurados/jurados.module';
@Module({
  imports: [EvaluacionModule, PrismaModule, JuradosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
