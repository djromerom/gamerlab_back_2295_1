import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateVideojuegoDto } from './dto/create-videojuegos.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuegos.dto';
import { randomBytes } from 'crypto';
import axios from 'axios';

@Injectable()
export class VideojuegosService {
  private readonly logger = new Logger(VideojuegosService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createDto: CreateVideojuegoDto) {
    const equipo = await this.prisma.equipo.findUnique({
      where: { id_equipo: createDto.id_equipo },
      include: { integrante: true },
    });
  
    if (!equipo) {
      this.logger.warn(`Equipo con ID ${createDto.id_equipo} no encontrado`);
      throw new NotFoundException(`Equipo con ID ${createDto.id_equipo} no encontrado`);
    }
  
    const existingVideojuego = await this.prisma.videojuego.findFirst({
      where: { id_equipo: createDto.id_equipo },
    });
  
    if (existingVideojuego) {
      throw new NotFoundException(`Este equipo ya tiene un videojuego registrado`);
    }
  
    try {
      const nuevo = await this.prisma.videojuego.create({
        data: {
          ...createDto,
          fecha_creacion: new Date(),
        },
      });
  
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/videojuegos/confirmar/${nuevo.id_videojuego}`;
      const enlaceHTML = `<p><a href="${url}">Confirmar inscripción</a></p>`;
  
      const html = `
        <h2>¡Nuevo videojuego registrado!</h2>
        <p>Equipo: <strong>${equipo.nombre}</strong></p>
        <p>Juego: <strong>${nuevo.nombre}</strong></p>
        <p>${nuevo.descripcion || ''}</p>
        <hr/>
        <p>Para confirmar la inscripción del equipo:</p>
        ${enlaceHTML}
      `;
  
      await this.mailService.sendMail(
        equipo.integrante.map(i => i.correo),
        'Confirmación de inscripción al videojuego',
        html,
      );
  
      return nuevo;
  
    } catch (error) {
      this.logger.error('Error al crear el videojuego:', error.stack);
      throw new InternalServerErrorException('No se pudo crear el videojuego. Inténtelo de nuevo más tarde.');
    }
  }

  async confirmar(id_videojuego: number) {
    const juego = await this.prisma.videojuego.findUnique({
      where: { id_videojuego },
      select: { id_equipo: true },
    });
  
    if (!juego) {
      throw new NotFoundException(`Este juego no existe`);
    }
  
    const equipo = await this.prisma.equipo.findUnique({
      where: { id_equipo: juego.id_equipo },
    });
  
    if (!equipo || equipo.id_estado === 2) {
      throw new NotFoundException(`Este juego ya ha sido confirmado`);
    }
  
    return this.prisma.equipo.update({
      where: { id_equipo: juego.id_equipo },
      data: { id_estado: 2 },
    });
  }
  
  async findAll() {
    return this.prisma.videojuego.findMany({
      where: {
        estado: true,
      },
      include: {
        equipo: true,
      },
    });
  }
  
  async findOne(id: number) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: {
        id_videojuego: id 
      },
      include: {
        equipo: true
      }
    });
  
    if (!videojuego) {
      throw new NotFoundException(`Videojuego con ID ${id} no encontrado`);
    }
  
    return videojuego;
  }

  async update(id: number, updateVideojuegoDto: UpdateVideojuegoDto) {
    await this.findOne(id);

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
    await this.findOne(id);

    return this.prisma.videojuego.delete({
      where: { id_videojuego: id },
    });
  }

  async verifyRecaptchaToken(token: string): Promise<boolean> {
    this.logger.debug(`Verificando token de reCAPTCHA: ${token.substring(0, 10)}...`);
    
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      this.logger.error('reCAPTCHA secret key no configurada en variables de entorno');
      throw new BadRequestException('Configuración de reCAPTCHA incompleta');
    }
    
    // Solo para entorno de desarrollo con token especial
    if (token === 'test' && process.env.NODE_ENV !== 'production') {
      this.logger.debug('Simulación de verificación de reCAPTCHA en entorno de desarrollo');
      return true;
    }

    try {
      this.logger.debug('Enviando solicitud a la API de verificación de reCAPTCHA de Google');
      
      const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: secretKey,
          response: token,
        },
      });

      this.logger.debug(`Respuesta de Google reCAPTCHA: ${JSON.stringify(response.data)}`);
      
      if (response.data.success) {
        this.logger.debug('Verificación de reCAPTCHA exitosa');
        return true;
      } else {
        this.logger.warn(`Verificación de reCAPTCHA fallida: ${JSON.stringify(response.data['error-codes'] || 'Sin detalles')}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error al verificar el token de reCAPTCHA: ${error.message}`, error.stack);
      throw new BadRequestException('Error al verificar el token de reCAPTCHA');
    }
  }
}