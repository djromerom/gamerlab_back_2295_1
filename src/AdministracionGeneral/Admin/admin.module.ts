import { Module } from '@nestjs/common';
import { AdminMateriaController } from './materia/adminMateria.controller';
import { AdminMateriaService } from './materia/adminMateria.service';
import { AdminCriterioController } from './criterio/adminCriterio.controller';
import { AdminCriterioService } from './criterio/adminCriterio.service';
import { AdminNrcController } from './nrc/adminNrc.controller';
import { AdminNrcService } from './nrc/adminNrc.service';
import { AdminUsuarioController } from './usuario/adminUsuario.controller';
import { AdminUsuarioService } from './usuario/adminUsuario.service';
import { MailService } from './usuario/email/email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [
    AdminMateriaController,
    AdminCriterioController,
    AdminNrcController,
    AdminUsuarioController,
  ],
  providers: [
    AdminMateriaService,
    AdminCriterioService,
    AdminNrcService,
    AdminUsuarioService,
    MailService,
    ConfigService,
  ],
})
export class AdminModule {}
