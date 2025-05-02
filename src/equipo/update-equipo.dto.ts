import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './dto/create-equipo.dto';

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {}