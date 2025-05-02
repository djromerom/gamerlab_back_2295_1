export class CreateEquipoDto {
    // El id_equipo, fecha_creacion y fecha_actualizacion son generados por la DB/Prisma
    nombre: string;
    token_captcha: string; 
    estado_incripcion: boolean;
    estado: boolean;
  }