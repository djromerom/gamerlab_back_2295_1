import { Module } from '@nestjs/common';
import { VideojuegosService } from './videojuegos.service';
import { VideojuegosController } from './videojuegos.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
  imports: [MailModule, PrismaModule],
  controllers: [VideojuegosController],
  providers: [VideojuegosService],
  exports: [VideojuegosService],
})
export class VideojuegosModule {}