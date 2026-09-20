import { BaseLayout } from '@/widgets/BaseLayout';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}

export default PublicLayout;
