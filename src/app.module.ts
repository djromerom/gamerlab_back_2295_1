import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JuradosModule } from './modules/jurados/jurados.module';
import { PrismaModule } from './prisma/prisma.module';
import { EvaluacionModule } from './modules/evaluacion/evaluacion.module';
import { MailModule } from './shared/mail/mail.module';
import { JuegosModule } from './modules/juegos/juegos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    JuradosModule,
    EvaluacionModule,
    JuegosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
