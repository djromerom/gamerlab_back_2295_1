import { estado } from "@prisma/client";

export class CreateEquipoDto {
    // El id_equipo, fecha_creacion y fecha_actualizacion son generados por la DB/Prisma
    nombre: string;
    estado: boolean;
    id_estado: number; // Relación con el modelo estado
    
  }