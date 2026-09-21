'use client';

import { useState } from 'react';
import { useLogout } from './useLogout';

export const useUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogout } = useLogout();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const onLogoutClick = async () => {
    closeMenu();
    await handleLogout();
  };

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    onLogoutClick,
  };
};
