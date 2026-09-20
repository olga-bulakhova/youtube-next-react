import { Header } from './Header';
import { SidebarProvider } from './SidebarContext'; // Провайдер внутри себя имеет 'use client' - это нормально
import { LayoutContent } from './LayoutContent'; // Создайте отдельный клиентский файл для разметки сетки

type BaseLayoutProps = {
  children: React.ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="relative mx-auto flex min-h-screen max-w-[1560px] flex-col justify-between px-4">
        <Header />

        <LayoutContent>{children}</LayoutContent>
      </div>
    </SidebarProvider>
  );
};
