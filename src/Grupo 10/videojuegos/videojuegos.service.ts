import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateVideojuegoDto } from './dto/create-videojuegos.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuegos.dto';
import { CreateEquipoDto } from '../equipo/dto/create-equipo.dto';
import axios from 'axios';


@Injectable()
export class VideojuegosService {
  private readonly logger = new Logger(VideojuegosService.name);
   constructor(
    private prisma: PrismaService,
    private mailService: MailService,    
  ) {}

  async create(createVideojuegoDto: CreateVideojuegoDto) {
    const { id_equipo } = createVideojuegoDto;  // Extraemos el id_equipo del DTO

    // Verificar la existencia del equipo antes de crear un videojuego
    await this.verifyEquipoExists(id_equipo);
    
    // Si el equipo existe, procedemos a crear el videojuego
    try {
      const nuevoVideojuego = await this.prisma.videojuego.create({
        data: {
          ...createVideojuegoDto,
          fecha_creacion: new Date(),
        },
      });

      this.logger.debug(`Videojuego creado con el ID ${nuevoVideojuego.id_videojuego}`);
      return nuevoVideojuego;
      
    } catch (error) {
      this.logger.error('Error al crear el videojuego:', error.stack);
      throw new InternalServerErrorException('No se pudo crear el videojuego. Inténtelo de nuevo más tarde.');
    }
  }

  private async verifyEquipoExists(id_equipo: number) {
    const equipo = await this.prisma.equipo.findFirst({
      where: { id_equipo }, // Utilizamos findFirst en lugar de findUnique


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

  async verifyRecaptchaToken(token: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      throw new Error('reCAPTCHA secret key not set in environment');
    }
    if ( token === 'test') {
      this.logger.debug('Simulación de verificación de reCAPTCHA en entorno de desarrollo');
      return true;
    }

    try {
      const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: secretKey,
          response: token,
        },
      });

      return response.data.success;
    } catch (error) {
      this.logger.error('Error verifying reCAPTCHA token:', error.stack);
      return false;
    }
  }
}