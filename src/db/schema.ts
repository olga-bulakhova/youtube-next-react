import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// 👤 Таблица пользователей
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// 📹 Таблица видеороликов
export const videosTable = sqliteTable('videos', {
  videoId: text('video_id').primaryKey(),
  title: text('title').notNull(),
  authorName: text('author_name').notNull(),
  authorUrl: text('author_url').notNull(),
  category: text('category').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  titleSearch: text('title_search').notNull(),
});

// 🔒 НОВАЯ ТАБЛИЦА: Токены восстановления пароля
// Полностью синхронизирована по названиям полей с нашими бэкенд-роутами сброса! [0.3]
export const passwordResetTokensTable = sqliteTable('password_reset_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Внешний ключ, связывающий токен с конкретным пользователем
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  // Уникальная криптографическая строка токена
  token: text('token').notNull().unique(),

  // Время истечения срока действия токена (Timestamp в миллисекундах)
  expiresAt: integer('expires_at').notNull(),
});
