import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateVideojuegoDto {
  @IsString()
  nombre: string;
  
  @IsString()
  token_captcha: string; // Token de reCAPTCHA para validación

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