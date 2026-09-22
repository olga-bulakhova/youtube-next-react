import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // папка, куда будут сохраняться файлы миграций
  schema: './src/db/schema.ts', // путь к вашему файлу schema.ts
  dialect: 'turso', // 'turso' используется для libsql / sqlite клиентов
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:local.db',
  },
});
