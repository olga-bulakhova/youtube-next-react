import 'server-only';
import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;

if (!user || !pass || !host) {
  console.warn(
    '⚠️ [MAIL_SYSTEM] Настройки SMTP (host, user или password) отсутствуют в .env. Письма не будут отправляться!',
  );
}


export const mailer = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, 
  auth: {
    user,
    pass,
  },
});
