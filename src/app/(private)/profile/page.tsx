import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { usersDb } from '@/app/api/auth/_storage/usersStorage';
import { serverCookies } from '@/shared/utils-server';
import { ProfileScreen } from '@/screen/ProfileScreen'; // Импортируем созданный экран

export const metadata: Metadata = {
  title: 'Мой профиль | Личный Видео-Хаб',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const sessionUser = await serverCookies.getUser();

  if (!sessionUser || !sessionUser.id) {
    redirect('/auth/login');
  }

  const dbUser = await usersDb.getUserById(sessionUser.id);

  if (!dbUser) {
    notFound();
  }
  return <ProfileScreen user={dbUser} />;
}
