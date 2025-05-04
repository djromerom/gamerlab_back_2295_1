import { transporter } from '../../libs/mailer';

async function sendBasicEmail() {
  const info = await transporter.sendMail({
    from: '"Mi App" <no-reply@miapp.com>',
    to: 'destinatario@ejemplo.com',
    subject: 'Correo de prueba Nodemailer',
    text: '¡Hola! Este es un correo enviado con Nodemailer.',
  });
  console.log('Mensaje enviado:', info.messageId);
}

sendBasicEmail().catch(console.error);
