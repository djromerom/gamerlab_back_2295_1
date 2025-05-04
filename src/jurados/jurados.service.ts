import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JuradosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerJurados() {
    return this.prisma.usuario.findMany({
      where: {
        estado: true,
        usuario_rol: {
          some: {
            id_rol: 2, // rol jurado
            estado: true,
          },
        },
      },
      select: {
        id_usuario: true,
        primer_nombre: true,
        correo: true,
        confirmado: true,
        ultima_conexion: true,
        evaluacion: {
          select: {
            id_evaluacion: true,
          },
        },
      },
    });
  }

  async eliminarJurado(id: number) {
    const jurado = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });

    if (!jurado) {
      throw new NotFoundException('Jurado no encontrado');
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: { estado: false }, // Desactivación lógica
    });
  }

  async reenviarInvitacion(idUsuario: number) {
    const jurado = await this.prisma.usuario.findUnique({
      where: { id_usuario: idUsuario },
    });

    if (!jurado || jurado.confirmado) {
      throw new NotFoundException('Usuario no encontrado o ya confirmado');
    }

    // Aquí usarías tu servicio real de email, por ahora es mock
    console.log(`📧 Reenviando invitación a: ${jurado.correo}`);
    return { message: 'Correo de invitación reenviado.' };
  }
}
