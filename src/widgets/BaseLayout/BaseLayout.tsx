import { Header } from './Header';
import { SidebarProvider } from './SidebarContext';
import { LayoutContent } from './LayoutContent';
import { serverCookies } from '@/shared/utils-server/cookies'; // 1. Импортируем наш серверный хелпер кук

type BaseLayoutProps = {
  children: React.ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const user = await serverCookies.getUser();

  return (
    <SidebarProvider>
      <div className="relative mx-auto flex min-h-screen max-w-[1560px] flex-col justify-between px-4">
        <Header />

        <LayoutContent user={user}>{children}</LayoutContent>
      </div>
    </SidebarProvider>
  );
};
