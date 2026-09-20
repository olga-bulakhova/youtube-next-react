import type { Metadata } from 'next';
import { AddVideoScreen } from '@/screen/AddVideoScreen';
import { withServerAuth } from '@/shared/hoc/withServerAuth';

export const metadata: Metadata = {
  title: 'Добавить видео',
};

function AddVideoPage() {
  return <AddVideoScreen />;
}

export default withServerAuth(AddVideoPage);
