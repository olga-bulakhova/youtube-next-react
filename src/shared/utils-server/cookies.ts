import { cookies } from 'next/headers';
import { IUserCookie } from '@/app/api/auth/_storage/types';
import { getUserDataFromToken } from './token';

const AUTH_COOKIE_NAME = 'x-auth-token';

export const serverCookies = {
  setToken: async (token: string, days = 7): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      path: '/',
      maxAge: days * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },

  getUser: async (): Promise<IUserCookie | null> => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!tokenCookie?.value) return null;

    const tokenData = getUserDataFromToken(tokenCookie.value);

    if (!tokenData) return null;

    return {
      id: tokenData.userId,
      username: tokenData.username,
    };
  },

  clearAuth: async (): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  },
};
