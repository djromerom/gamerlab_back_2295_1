import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJuradoDto {
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsNotEmpty()
  primer_apellido: string;

  @IsString()
  @IsNotEmpty()
  segundo_apellido: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;
} 