import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateVideojuegoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  id_equipo: number;

  @IsBoolean()
  estado: boolean;

  @IsString()
  token_captcha: string;
}