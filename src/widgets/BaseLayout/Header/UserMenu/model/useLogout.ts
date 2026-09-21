'use client';

import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/api/auth';
import { APP_ROUTES } from '@/shared/constants';

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.replace(APP_ROUTES.HOME);
      router.refresh();
    } catch (error) {
      console.error('Ошибка при выходе из системы через API-сервис:', error);
    }
  };

  return {
    handleLogout,
  };
};
