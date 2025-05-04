import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Mi App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return res.status(200).json({ message: 'Correo enviado', info });
  } catch (error) {
    return res.status(500).json({ message: 'Error enviando correo', error });
  }
}
