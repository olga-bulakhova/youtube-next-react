import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const videosTable = sqliteTable('videos', {
  videoId: text('video_id').primaryKey(),
  title: text('title').notNull(),
  authorName: text('author_name').notNull(),
  authorUrl: text('author_url').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  titleSearch: text('title_search').notNull(),
});

export const userCollectionsTable = sqliteTable('user_collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Кто добавил видео
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  // Какое видео добавил
  videoId: text('video_id')
    .notNull()
    .references(() => videosTable.videoId, { onDelete: 'cascade' }),

  // Персональная категория для видео (каждый юзер может выбрать свою!)
  category: text('category').notNull(),

  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// 4. Таблица токенов восстановления пароля (без изменений)
export const passwordResetTokensTable = sqliteTable('password_reset_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at').notNull(),
});
