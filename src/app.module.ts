import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EstudiantesModule } from './estudiantes/estudiantes.module'; // Importa el nuevo módulo
import { EquiposModule } from './equipo/equipos.module';

@Module({
  imports: [EstudiantesModule, EquiposModule], 
  controllers: [AppController], 
  providers: [],
})
export class AppModule {}