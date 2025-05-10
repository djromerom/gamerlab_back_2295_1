import { IsInt, IsBoolean } from 'class-validator';

export class CreateIntegranteNrcDto {
  @IsInt()
  id_integrante: number;

  @IsInt()
  id_nrc: number;

  @IsBoolean()
  estado: boolean;
}