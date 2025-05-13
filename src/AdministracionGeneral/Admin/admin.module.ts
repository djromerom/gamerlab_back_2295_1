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
import { MonitoreoController } from './monitoreo/monitoreo.controller';
import { MonitoreoService } from './monitoreo/monitoreo.service';

@Module({
  imports: [],
  controllers: [
    AdminMateriaController,
    AdminCriterioController,
    AdminNrcController,
    AdminUsuarioController,
    ConfirmacionController,
    MonitoreoController,
  ],
  providers: [
    AdminMateriaService,
    AdminCriterioService,
    AdminNrcService,
    AdminUsuarioService,
    MailService,
    MonitoreoService,
  ],
  exports: [
    AdminMateriaService,
    AdminCriterioService,
    AdminNrcService,
    AdminUsuarioService,
    MailService,
    MonitoreoService,
  ]
})
export class AdminModule {}
