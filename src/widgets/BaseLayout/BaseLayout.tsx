'use client';

import { Suspense } from 'react'; // 1. Импортируем Suspense
import { Header } from './Header';
import { LeftMenu } from './LeftMenu';
import { SidebarProvider, useSidebar } from './SidebarContext';

type BaseLayoutProps = {
  children: React.ReactNode;
};

const LayoutContent = ({ children }: BaseLayoutProps) => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[1920px] flex-col justify-between px-4">
      <Header profileId="123" />

      <main className="mx-auto w-full max-w-[1440px] flex-1 py-4">
        {children}
      </main>

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
          fallback={<div className="p-4 text-zinc-500">Загрузка меню...</div>}
        >
          <LeftMenu />
        </Suspense>
      </div>
    </div>
  );
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};
