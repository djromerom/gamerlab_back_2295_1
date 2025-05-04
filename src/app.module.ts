import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EstudiantesModule } from './Grupo 10/estudiantes/estudiantes.module';
import { EquiposModule } from './Grupo 10/equipo/equipos.module';
import { VideojuegosModule } from './Grupo 10/videojuegos/videojuegos.module';
import { AuthModule } from './AdministracionGeneral/auth/auth.module';
import { AdminModule } from './AdministracionGeneral/Admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './Grupo 10/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EstudiantesModule, EquiposModule, VideojuegosModule, PrismaModule,AuthModule, AdminModule, MailModule, ConfigModule.forRoot({ isGlobal: true })], 
  controllers: [AppController], 
  providers: [],
})
export class AppModule {}