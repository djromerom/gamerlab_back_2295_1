import { Module } from '@nestjs/common';
import { VideojuegosController } from '../controllers/videojuegos.controller';
import { VideojuegosService } from '../services/videojuegos.services';

@Module({
  controllers: [VideojuegosController],
  providers: [VideojuegosService],
})
export class VideojuegosModule {}