import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateEquipoDto {
  @IsString()
  nombre: string;

  @IsInt()
  id_estado: number;

  @IsBoolean()
  estado: boolean;

}
