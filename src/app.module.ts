import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JuradosModule } from './GestionJurados/modules/jurados/jurados.module';
import { PrismaModule } from './GestionJurados/prisma/prisma.module';
import { EvaluacionModule } from './GestionJurados/modules/evaluacion/evaluacion.module';
import { MailModule } from './GestionJurados/shared/mail/mail.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Módulos de infraestructura
    PrismaModule,
    MailModule,

    // Módulos de funcionalidad
    JuradosModule,
    EvaluacionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
