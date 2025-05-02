import { Module } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
import { PrismaService } from '../../prisma/prisma.service'; 

@Module({
  controllers: [EquiposController],
  providers: [EquiposService, PrismaService],
  exports: [EquiposService] 
})
export class EquiposModule {}