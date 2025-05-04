import { Module } from "@nestjs/common";
import { AdminMateriaController } from "./materia/adminMateria.controller";
import { AdminMateriaService } from "./materia/adminMateria.service";
import { AdminCriterioController } from "./criterio/adminCriterio.controller";
import { AdminCriterioService} from "./criterio/adminCriterio.service";
import { AdminNrcController } from "./nrc/adminNrc.controller";
import { AdminNrcService } from "./nrc/adminNrc.service";

@Module({
    imports: [],
    controllers: [AdminMateriaController, AdminCriterioController, AdminNrcController],
    providers: [AdminMateriaService, AdminCriterioService, AdminNrcService],

})
export class AdminModule {}

