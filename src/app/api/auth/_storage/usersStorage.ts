import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { IUser } from './types';
import { usersTable } from '@/db/schema';
import { db } from '@/db';

const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
};

export const usersDb = {
  // Получить всех пользователей
  getAllUsers: async (): Promise<IUser[]> => {
    const rows = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable);

    return rows;
  },

  // Получить пользователя по ID
  getUserById: async (id: number): Promise<IUser | undefined> => {
    const rows = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return rows[0];
  },

  // Получить пользователя по имени (регистронезависимо)
  getUserByUsername: async (username: string): Promise<IUser | undefined> => {
    const cleanUsername = username.toLowerCase().trim();

    // SQLite по умолчанию выполняет поиск оператором LIKE регистронезависимо
    const rows = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.username, cleanUsername))
      .limit(1);

    return rows[0];
  },

  // Добавить пользователя
  addUser: async (username: string, passwordPlain: string): Promise<IUser> => {
    const [insertedUser] = await db
      .insert(usersTable)
      .values({
        username: username,
        passwordHash: hashPassword(passwordPlain),
      })
      .returning({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      });

    return insertedUser;
  },

  // Проверка занятости имени
  isUsernameTaken: async (username: string): Promise<boolean> => {
    const cleanUsername = username.toLowerCase().trim();
    const rows = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, cleanUsername))
      .limit(1);

    return rows.length > 0;
  },

  // Проверить пароль
  verifyPassword: async (
    userId: number,
    passwordPlain: string,
  ): Promise<boolean> => {
    const rows = await db
      .select({ passwordHash: usersTable.passwordHash })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (rows.length === 0) return false;

    return rows[0].passwordHash === hashPassword(passwordPlain);
  },
};
