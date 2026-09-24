import crypto from 'crypto';
import { eq, sql } from 'drizzle-orm';
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
  getUserByEmail: async (email: string): Promise<IUser | undefined> => {
    const cleanEmail = email.toLowerCase().trim();

    const rows = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(sql`lower(${usersTable.email})`, cleanEmail))
      .limit(1);

    return rows[0];
  },

  //  Добавлен прием параметра email и его сохранение в таблицу базы данных 
  addUser: async (
    username: string,
    email: string,
    passwordPlain: string,
  ): Promise<IUser> => {
    const [insertedUser] = await db
      .insert(usersTable)
      .values({
        username: username.trim(),
        email: email.trim().toLowerCase(), // Защита от дубликатов на уровне СУБД 
        passwordHash: hashPassword(passwordPlain),
      })
      .returning({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      });

    return insertedUser;
  },


  // 🌟 НОВОЕ: Метод для проверки занятости адреса электронной почты в базе данных [0.2]
  isEmailTaken: async (email: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();
    const rows = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, cleanEmail))
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
