import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseJsonCookie } from '../utils/cookies'; // Путь к вашему хелперу кук
import { IUserCookie } from '@/app/api/auth/_storage/types'; // Путь к вашему интерфейсу

interface AuthenticatedUser {
  userId: number;
  username: string;
}

export const requireServerAuth = async (): Promise<AuthenticatedUser> => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');

  const user = parseJsonCookie<IUserCookie>(userCookie?.value);

  if (!user || !user.id || !user.username) {
    redirect('/auth/login');
  }

  return {
    userId: user.id,
    username: user.username,
  };
};
