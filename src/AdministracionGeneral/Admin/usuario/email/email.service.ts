import { Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
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

async sendWelcomeEmail(email: string, token: string, role: string) {
  try {
    const confirmUrl = `http://localhost:3000/confirmacion/${token}`;

    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    const info = await this.transporter.sendMail({
      from: '"Sistema de Registro" <noreply@sistema.com>',
      to: email,
      subject: `Confirmación de cuenta - ${capitalizedRole}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bienvenido al Sistema de Registro</h2>
          <p>Hola,</p>
          <p>Has sido registrado como <strong>${role.toLowerCase()}</strong> en nuestra plataforma.</p>
          <p>Para activar tu cuenta y establecer tu contraseña, por favor haz clic en el siguiente enlace:</p>
          <div style="margin: 20px 0;">
            <a href="${confirmUrl}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirmar Cuenta
            </a>
          </div>
          <p>O copia y pega esta URL en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${confirmUrl}</p>
          <p>Si no esperabas este registro, puedes ignorar este mensaje.</p>
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