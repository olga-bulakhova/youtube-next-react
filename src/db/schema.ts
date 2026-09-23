import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Ваша существующая таблица пользователей
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// НОВАЯ ТАБЛИЦА ВИДЕО
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
