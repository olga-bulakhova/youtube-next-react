'use client';

import { MenuIcon } from '@/shared/icons';
import { useSidebar } from './SidebarContext';

export const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      aria-label="Главное меню"
    >
      <MenuIcon />
    </button>
  );
};
