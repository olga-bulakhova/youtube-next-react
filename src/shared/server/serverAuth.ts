import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserDataFromToken } from './token';

interface AuthenticatedUser {
  userId: number;
  username: string;
}

export const requireServerAuth = async (): Promise<AuthenticatedUser> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  const tokenData = getUserDataFromToken(tokenCookie?.value);

  if (!tokenData || !tokenData.userId || !tokenData.username) {
    redirect('/auth/login');
  }

  return {
    userId: tokenData.userId,
    username: tokenData.username,
  };
};
