import 'server-only'; 
import { z } from 'zod';

const serverSchema = z.object({
  TOKEN_PREFIX: z
    .string()
    .min(5, {
      message: 'TOKEN_PREFIX в .env отсутствует или слишком короткий',
    }),
});


export const serverEnv = serverSchema.parse({
  TOKEN_PREFIX: process.env.TOKEN_PREFIX,
});


