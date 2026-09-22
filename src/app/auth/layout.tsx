import { MainLogo } from '@/shared/ui/MainLogo';

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="px-3">
      <MainLogo className="m-4" />
      {children}
    </div>
  );
}
