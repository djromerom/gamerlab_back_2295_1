import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private async createTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('=== Configuración de Ethereal ===');
    console.log('Usuario:', testAccount.user);
    console.log('Contraseña:', testAccount.pass);
    console.log('URL de Ethereal:', 'https://ethereal.email');
    console.log('===============================');
  }

  async sendWelcomeEmail(email: string, token: string) {
    try {
      const confirmUrl = `http://localhost:3000/jurados/confirm/${token}`;

      const info = await this.transporter.sendMail({
        from: '"Sistema de Jurados" <noreply@jurados.com>',
        to: email,
        subject: 'Confirmación de Cuenta - Sistema de Jurados',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Bienvenido al Sistema de Jurados</h2>
            <p>Gracias por aceptar ser parte de nuestro panel de jurados.</p>
            <p>Para confirmar tu cuenta, por favor haz clic en el siguiente enlace:</p>
            <div style="margin: 20px 0;">
              <a href="${confirmUrl}" 
                 style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirmar Cuenta
              </a>
            </div>
            <p>O copia y pega esta URL en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${confirmUrl}</p>
            <p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
          </div>
        `,
      });

      console.log('=== Información del Correo Enviado ===');
      console.log('ID del mensaje:', info.messageId);
      console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info));
      console.log('URL de confirmación:', confirmUrl);
      console.log('====================================');

      return info;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }
} 