// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';              // ← CORRECCIÓN aquí

@Injectable()
export class MailService {
  private transporter;

  constructor(private config: ConfigService) {
    // Creamos el transporter usando ConfigService
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });

    // Opcional: verificar conexión SMTP al iniciar
    this.transporter.verify((err, success) => {
      if (err) {
        console.error('Error al verificar SMTP:', err);
      } else {
        console.log('SMTP listo para enviar correos');
      }
    });
  }

  async sendMail(to: string | string[], subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"GamerLab" <${this.config.get<string>('SMTP_USER')}>`,
        to: this.config.get<string>('SMTP_USER') ,
        subject: 'Asunto importante',
        html:'<h1>Contenido</h1>'
      });
      return info;
    } catch (err) {
      console.error('Error enviando correo:', err);
      throw new InternalServerErrorException('No se pudo enviar el correo.');
    }
  }
}
