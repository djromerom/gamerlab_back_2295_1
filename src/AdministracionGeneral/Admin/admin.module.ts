import { Module } from "@nestjs/common";
import { AdminMateriaController } from "./materia/adminMateria.controller";
import { AdminMateriaService } from "./materia/adminMateria.service";
import { AdminCriterioController } from "./criterio/adminCriterio.controller";
import { AdminCriterioService} from "./criterio/adminCriterio.service";

@Module({
    imports: [],
    controllers: [AdminMateriaController, AdminCriterioController],
    providers: [AdminMateriaService, AdminCriterioService],

})
export class AdminModule {}

