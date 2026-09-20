import { MainLogo } from '@/shared/ui/MainLogo';

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <MainLogo className="m-4" />
      {children}
    </>
  );
}
