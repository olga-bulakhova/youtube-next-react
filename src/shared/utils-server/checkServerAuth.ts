import { redirect } from 'next/navigation';
import { serverCookies } from './cookies';
import { APP_ROUTES } from '../constants';

interface AuthenticatedUser {
  userId: number;
  username: string;
}

export const requireServerAuth = async (): Promise<AuthenticatedUser> => {
  const user = await serverCookies.getUser();

  if (!user || !user.id || !user.username) {
    redirect(APP_ROUTES.AUTH.LOGIN);
  }

  return {
    userId: user.id,
    username: user.username,
  };
};
