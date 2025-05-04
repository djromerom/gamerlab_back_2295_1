import { estado } from "@prisma/client";

export class CreateEquipoDto {
    // El id_equipo, fecha_creacion y fecha_actualizacion son generados por la DB/Prisma
    nombre: string;
    token_captcha: string; 
    estado: boolean;
    estado_equipo: {
      connect: {
        id_estado: number;
      };
    
  }}