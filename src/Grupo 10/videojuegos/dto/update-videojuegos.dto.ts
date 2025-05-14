import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class UpdateVideojuegoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsString()
  token_captcha: string; 

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  id_equipo?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}