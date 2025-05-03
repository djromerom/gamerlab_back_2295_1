import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class UpdateVideojuegoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  id_equipo?: number;

  @IsOptional()
  @IsInt()
  id_materia?: number;

  @IsOptional()
  @IsInt()
  id_nrc?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}