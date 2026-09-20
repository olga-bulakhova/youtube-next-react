import crypto from 'crypto';
import { IUser } from './types';

declare global {
  var prismaMockUsersMap: Map<number, IUser> | undefined;
  var prismaMockPasswordsMap: Map<number, string> | undefined;
}

const hashPassword = (password: string): string => {
  return crypto
    .createHash('sha256') // Инициализируем алгоритм SHA-256 [0.4]
    .update(password.trim()) // Передаем очищенный пароль
    .digest('hex'); // Превращаем в читаемую шестнадцатеричную строку (длиной 64 символа)
};

const usersMap =
  globalThis.prismaMockUsersMap ??
  new Map<number, IUser>([
    [
      1,
      {
        id: 1,
        username: 'Разработчик',
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

const passwordsMap =
  globalThis.prismaMockPasswordsMap ??
  new Map<number, string>([[1, hashPassword('password123')]]);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaMockUsersMap = usersMap;
  globalThis.prismaMockPasswordsMap = passwordsMap;
}

export const usersDb = {
  getAllUsers: (): IUser[] => {
    return Array.from(usersMap.values());
  },

  getUserById: (id: number): IUser | undefined => {
    return usersMap.get(id);
  },

  getUserByUsername: (username: string): IUser | undefined => {
    const cleanUsername = username.toLowerCase().trim();
    return Array.from(usersMap.values()).find(
      (user) => user.username.toLowerCase().trim() === cleanUsername,
    );
  },

  addUser: (user: IUser, passwordPlain: string): void => {
    usersMap.set(user.id, user);
    usersMap.set(user.id, user);
    passwordsMap.set(user.id, hashPassword(passwordPlain));
  },

  isUsernameTaken: (username: string): boolean => {
    const cleanUsername = username.toLowerCase().trim();
    return Array.from(usersMap.values()).some(
      (user) => user.username.toLowerCase().trim() === cleanUsername,
    );
  },

  verifyPassword: (userId: number, passwordPlain: string): boolean => {
    const savedHash = passwordsMap.get(userId);
    if (!savedHash) return false;

    return savedHash === hashPassword(passwordPlain);
  },

  getNextId: (): number => {
    const keys = Array.from(usersMap.keys());
    return keys.length > 0 ? Math.max(...keys) + 1 : 1;
  },
};
