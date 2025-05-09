import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JuradosModule } from './modules/jurados/jurados.module';
import { PrismaModule } from './prisma/prisma.module';
import { EvaluacionModule } from './modules/evaluacion/evaluacion.module';
import { MailModule } from './shared/mail/mail.module';

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
