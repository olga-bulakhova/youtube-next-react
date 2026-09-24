import 'server-only';
import { Resend } from 'resend';
import { serverEnv } from '../utils-server/serverEnv';

const apiKey = serverEnv.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    '⚠️ [MAIL_SYSTEM] Внимание: Переменная RESEND_API_KEY отсутствует в файле .env. Письма не будут отправляться!',
  );
}

export const mailer = new Resend(apiKey);
