import { Module } from '@nestjs/common';
import { JuradosController } from './controllers/jurados.controller';
import { JuradosService } from './services/jurados.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailModule } from '../../shared/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [JuradosController],
  providers: [JuradosService],
  exports: [JuradosService],
})
export class JuradosModule {} 
// comentario