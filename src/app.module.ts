import { Module } from '@nestjs/common';
import { AuthModule } from './AdministracionGeneral/auth/auth.module';
import { AdminModule } from './AdministracionGeneral/Admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { VideojuegosModule } from './EvaluacionVideojuegos/modules/videojuegos.module';
import { CriteriosModule } from './EvaluacionVideojuegos/modules/criterios.module';
import { EvaluacionModule } from './EvaluacionVideojuegos/modules/evaluacion.module';
import { JuradosModule } from './GestionJurados/modules/jurados/jurados.module';
import { MailModule } from './GestionJurados/shared/mail/mail.module';
import { EvaluacionJuradosModule } from './GestionJurados/modules/evaluacion/evaluacion.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    VideojuegosModule,
    CriteriosModule,
    EvaluacionModule,
    JuradosModule,
    MailModule,
    EvaluacionJuradosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
