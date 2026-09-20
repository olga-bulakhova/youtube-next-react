import { BaseLayout } from '@/widgets/BaseLayout';

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}

export default PrivateLayout;
