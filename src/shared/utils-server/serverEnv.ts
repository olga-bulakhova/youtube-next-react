import 'server-only';
import { z } from 'zod';

const serverSchema = z.object({
  TOKEN_PREFIX: z.string().min(5, {
    message: 'TOKEN_PREFIX в .env отсутствует или слишком короткий',
  }),
  JWT_SECRET: z.string().min(32, {
    message: 'JWT_SECRET в .env отсутствует или слишком короткий',
  }),
  YOUTUBE_API_KEY: z.string().min(5, {
    message: 'YOUTUBE_API_KEY в .env отсутствует или слишком короткий',
  }),
  RESEND_API_KEY: z.string().min(5, {
    message: 'RESEND_API_KEY в .env отсутствует или слишком короткий',
  }),
});

export const serverEnv = serverSchema.parse({
  TOKEN_PREFIX: process.env.TOKEN_PREFIX,
  JWT_SECRET: process.env.JWT_SECRET,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
});
