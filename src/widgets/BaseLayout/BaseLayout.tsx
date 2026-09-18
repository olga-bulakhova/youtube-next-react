import { Header } from './Header';
import { LeftMenu } from './LeftMenu';

type BaseLayoutProps = {
  children: React.ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1560px] flex-col justify-between px-4">
      <Header profileId="123" />
      <main className="grid flex-1 grid-cols-[240px_1fr] gap-6">
        <LeftMenu />
        <div className="px-4 py-1">{children}</div>
      </main>
    </div>
  );
};
