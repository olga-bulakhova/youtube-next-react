import { NotFoundPage } from '@/screen/NotFoundPage'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Страница не найдена',

};

export default function NotFound() {
	return <NotFoundPage />
}
