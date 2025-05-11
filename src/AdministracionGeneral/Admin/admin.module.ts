import { Module } from '@nestjs/common';
import { AdminMateriaController } from './materia/adminMateria.controller';
import { AdminMateriaService } from './materia/adminMateria.service';
import { AdminCriterioController } from './criterio/adminCriterio.controller';
import { AdminCriterioService } from './criterio/adminCriterio.service';
import { AdminNrcController } from './nrc/adminNrc.controller';
import { AdminNrcService } from './nrc/adminNrc.service';
import { AdminUsuarioController } from './usuario/adminUsuario.controller';
import { AdminUsuarioService } from './usuario/adminUsuario.service';
import { ConfirmacionController } from './usuario/confirmacion/comfirmacion.controller';
import { MailService } from './usuario/email/email.service';

@Module({
  imports: [],
  controllers: [
    AdminMateriaController,
    AdminCriterioController,
    AdminNrcController,
    AdminUsuarioController,
    ConfirmacionController,
  ],
  providers: [
    AdminMateriaService,
    AdminCriterioService,
    AdminNrcService,
    AdminUsuarioService,
    MailService,
  ],
  exports: [
    AdminMateriaService,
    AdminCriterioService,
    AdminNrcService,
    AdminUsuarioService,
    MailService,
  ]
})
export class AdminModule {}
