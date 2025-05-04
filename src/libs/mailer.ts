import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // p. ej. 'smtp.gmail.com'
  port: Number(process.env.SMTP_PORT), // p. ej. 587
  secure: false,                      // false = STARTTLS; true = SSL/TLS (port 465)
  auth: {
    user: process.env.SMTP_USER,      // tu usuario SMTP
    pass: process.env.SMTP_PASS,      // tu contraseña o App Password
  },
});