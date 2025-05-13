import { Module } from '@nestjs/common';
import { JuegosController } from './juegos.controller';
import { JuegosService } from './juegos.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JuegosController],
  providers: [JuegosService],
})
export class JuegosModule {} 