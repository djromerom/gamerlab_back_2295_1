import { Module } from '@nestjs/common';
import { VideojuegosService } from './videojuegos.service';
import { VideojuegosController } from './videojuegos.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VideojuegosController],
  providers: [VideojuegosService, PrismaService],
  exports: [VideojuegosService],
})
export class VideojuegosModule {}