import { Module } from '@nestjs/common';
import { JuradosService } from './jurados.service';
import { JuradosController } from './jurados.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JuradosController],
  providers: [JuradosService],
})
export class JuradosModule {}
