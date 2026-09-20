'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        console.error('Ошибка сервера при попытке логаута');
      }
    } catch (error) {
      console.error('Сетевая ошибка при логауте:', error);
    } finally {
      closeMenu();
      router.replace('/');
      router.refresh();
    }
  };

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
  };
};
