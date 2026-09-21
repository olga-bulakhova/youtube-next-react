import { cookies } from 'next/headers';
import { IUserCookie } from '@/app/api/auth/_storage/types';
import { getUserDataFromToken } from './token';

export const serverCookies = {
  setToken: async (token: string, days = 7): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      path: '/',
      maxAge: days * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },

  getUser: async (): Promise<IUserCookie | null> => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

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
    cookieStore.delete('token');
    cookieStore.delete('user');
  },
};
