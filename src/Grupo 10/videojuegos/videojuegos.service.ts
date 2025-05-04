import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateVideojuegoDto } from './dto/create-videojuegos.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuegos.dto';

@Injectable()
export class VideojuegosService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,    // ← Inyectamos MailService
  ) {}

  async create(createDto: CreateVideojuegoDto) {
    const equipo = await this.prisma.equipo.findUnique({
      where: { id_equipo: createDto.id_equipo },
      include: { integrante: true },      // ← traemos integrantes y sus correos
    });
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${createDto.id_equipo} no encontrado`);
    }

    const nuevo = await this.prisma.videojuego.create({
      data: {
        ...createDto,
        fecha_creacion: new Date(),
      },
    });

    // Preparar y enviar correos a cada integrante
    const enlaces = equipo.integrante.map(int => {
      // ejemplo de enlace de confirmación (puedes adaptarlo)
      const url = `${process.env.FRONTEND_URL}/confirmar/${int.id_integrante}`;
      return `<p><a href="${url}">Confirmar inscripción</a></p>`;
    }).join('\n');

    const html = `
      <h2>¡Nuevo videojuego registrado!</h2>
      <p>Equipo: <strong>${equipo.nombre}</strong></p>
      <p>Juego: <strong>${nuevo.nombre}</strong></p>
      <p>${nuevo.descripcion || ''}</p>
      <hr/>
      <p>Para confirmar, pulsa en tu enlace:</p>
      ${enlaces}
    `;

    // Enviamos un solo mail con todos los destinatarios en copia oculta (BCC)
    await this.mailService.sendMail(
      equipo.integrante.map(i => i.correo),
      'Confirmación de inscripción al videojuego',
      html,
    );

    return nuevo;
  }


  async findAll() {
    return this.prisma.videojuego.findMany({
      include: {
        equipo: true,
      },
    });
  }

  async findOne(id: number) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: { id_videojuego: id },
      include: {
        equipo: true,
      },
    });

    if (!videojuego) {
      throw new NotFoundException(`Videojuego con ID ${id} no encontrado`);
    }

    return videojuego;
  }

  async update(id: number, updateVideojuegoDto: UpdateVideojuegoDto) {
    await this.findOne(id);

    // Si se actualiza el id_equipo, verificar que existe
    if (updateVideojuegoDto.id_equipo) {
      const equipo = await this.prisma.equipo.findUnique({
        where: { id_equipo: updateVideojuegoDto.id_equipo },
      });

      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${updateVideojuegoDto.id_equipo} no encontrado`);
      }
    }
    if (updateVideojuegoDto.descripcion && updateVideojuegoDto.descripcion.length > 300) {
      throw new NotFoundException('La descripción no puede exceder los 300 caracteres.');
    }

    return this.prisma.videojuego.update({
      where: { id_videojuego: id },
      data: {
        ...updateVideojuegoDto,
        fecha_actualizacion: new Date(),
      },
    });
  }

  async remove(id: number) {
    // Verificar si existe el videojuego
    await this.findOne(id);

    return this.prisma.videojuego.delete({
      where: { id_videojuego: id },
    });
  }
}