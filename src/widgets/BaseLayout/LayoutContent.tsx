'use client';

import { useSidebar } from './SidebarContext';
import { LeftMenu } from './LeftMenu';
import { Suspense } from 'react';
import { IUserCookie } from '@/app/api/auth/_storage/types';

type LayoutContentProps = {
  children: React.ReactNode;
  user: IUserCookie | null;
};

export const LayoutContent = ({ children, user }: LayoutContentProps) => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <main className="h-full flex-1 py-4">{children}</main>

      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] border-r border-zinc-800/50 bg-black p-2 pt-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Suspense
          fallback={<div className="p-4 text-zinc-500">Загрузка...</div>}
        >
          <LeftMenu user={user} />
        </Suspense>
      </div>
    </>
  );
};
