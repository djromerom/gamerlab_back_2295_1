import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateVideojuegoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  id_equipo: number;

  @IsInt()
  id_materia: number;

  @IsInt()
  id_nrc: number;

  @IsBoolean()
  estado: boolean;
}