import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EstudiantesModule } from './Grupo 10/estudiantes/estudiantes.module'; // Importa el nuevo módulo
import { EquiposModule } from './Grupo 10/equipo/equipos.module';
import { VideojuegosModule } from './Grupo 10/videojuegos/videojuegos.module';

@Module({
  imports: [EstudiantesModule, EquiposModule, VideojuegosModule], 
  controllers: [AppController], 
  providers: [],
})
export class AppModule {}