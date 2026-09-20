'use client';

import { useSidebar } from '../SidebarContext';

export const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      aria-label="Главное меню"
    >
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path d="M21 6H3V5h18v11zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
      </svg>
    </button>
  );
};
