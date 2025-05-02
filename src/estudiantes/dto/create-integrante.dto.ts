import { IsString, IsEmail, IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateIntegranteDto {
  @IsInt()
  @IsNotEmpty()
  id_equipo: number;

  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  usuario_github: string;

  @IsBoolean()
  estado: boolean; 

  // id_integrante, fecha_creacion, fecha_actualizacion son gestionados por la BD
}