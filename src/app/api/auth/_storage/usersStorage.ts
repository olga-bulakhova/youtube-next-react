import crypto from 'crypto';
import { eq, sql, and, gte } from 'drizzle-orm';
import { IUser } from './types';
import { passwordResetTokensTable, usersTable } from '@/db/schema';
import { db } from '@/db';

const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
};

export const usersDb = {
  /**
   * 🛠️ ВНУТРЕННИЙ МЕТОД: Базовый регистронезависимый поиск пользователя по Email
   * Выносит общее взаимодействие с БД, предотвращая дублирование разметки select
   */
  findUserByEmail: async (email: string): Promise<IUser | undefined> => {
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

  /**
   * Получить всех пользователей (GET)
   */
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

  /**
   * Получить пользователя по его уникальному ID
   */
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

  /**
   * Получить пользователя по Email (регистронезависимо)
   * 🌟 ОПТИМИЗИРОВАННО: Теперь использует вынесенный метод взаимодействия с СУБД
   */
  getUserByEmail: async (email: string): Promise<IUser | undefined> => {
    return usersDb.findUserByEmail(email);
  },

  /**
   * Добавить нового пользователя в систему при регистрации
   */
  addUser: async (
    username: string,
    email: string,
    passwordPlain: string,
  ): Promise<IUser> => {
    const [insertedUser] = await db
      .insert(usersTable)
      .values({
        username: username.trim(),
        email: email.trim().toLowerCase(), // Защита от дубликатов на уровне регистра СУБД
        passwordHash: hashPassword(passwordPlain),
      })
      .returning({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      });

    return insertedUser;
  },

  /**
   * Проверить занятость адреса электронной почты в базе данных
   * 🌟 ОПТИМИЗИРОВАННО: Использует метод findUserByEmail, возвращая булево значение
   */
  isEmailTaken: async (email: string): Promise<boolean> => {
    const user = await usersDb.findUserByEmail(email);
    return !!user;
  },

  /**
   * Асинхронно проверить захешированный пароль пользователя при входе
   */
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

  validateResetToken: async (token: string, currentTime: number) => {
    const [dbToken] = await db
      .select({
        id: passwordResetTokensTable.id,
        userId: passwordResetTokensTable.userId,
        expiresAt: passwordResetTokensTable.expiresAt,
      })
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.token, token.trim()),
          gte(passwordResetTokensTable.expiresAt, currentTime),
        ),
      )
      .limit(1);

    return dbToken; // Возвращает токен или undefined, если он просрочен/не существует
  },

  resetUserPassword: async (
    userId: number,
    tokenId: number,
    passwordPlain: string,
  ): Promise<void> => {
    const newPasswordHash = hashPassword(passwordPlain);

    // Запускаем безопасную транзакцию
    await db.transaction(async (tx) => {
      // 1. Обновляем хэш пароля у пользователя
      await tx
        .update(usersTable)
        .set({ passwordHash: newPasswordHash })
        .where(eq(usersTable.id, userId));

      // 2. Намертво удаляем использованный токен восстановления, защищая от повторного использования
      await tx
        .delete(passwordResetTokensTable)
        .where(eq(passwordResetTokensTable.id, tokenId));
    });
  },
};
