import { IsEmail, IsInt, IsString, IsBoolean, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateIntegranteDto {
  @IsInt()
  id_equipo: number;

  @IsString()
  primer_nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  usuario_github: string;

  @IsBoolean()
  estado: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  nrcIds?: number[];
}