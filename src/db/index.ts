import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema'; // Убедитесь, что путь к вашему schema.ts верен

// 🌟 ИСПРАВЛЕНО: Код автоматически проверяет переменные окружения Vercel + Turso.
// Если мы в интернете, он берет TURSO_URL и TURSO_AUTH_TOKEN [4.3].
// Если мы работаем локально на компьютере, он ищет DATABASE_URL или создает локальный файл [0.3].
const dbUrl =
  process.env.TURSO_URL || process.env.DATABASE_URL || 'file:local.db';
const dbToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url: dbUrl,
  authToken: dbToken, // Передаем токен авторизации (он обязателен для работы с облаком Turso) [4.3]
});

// Экспортируем готовый инстанс базы данных для работы во всех наших репозиториях (usersDb, videosDb)
export const db = drizzle(client, { schema });
