import { Module } from '@nestjs/common';
import { CriteriosController } from '../controllers/criterios.controller';
import { CriteriosService } from '../services/criterios.services';

@Module({
controllers: [CriteriosController],
providers: [CriteriosService],
})
export class CriteriosModule {}