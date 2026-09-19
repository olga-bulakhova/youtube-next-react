import { VideosListScreen } from '@/screen/VideoListScreen';
import type { Metadata } from 'next';
import { db } from '@/app/api/_utils/storage';

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export const metadata: Metadata = {
  title: 'Видео категории',
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = (await params).categoryId;

  const videos = db.getVideosByCategory(categoryId);

  return <VideosListScreen videos={videos} category={categoryId} />;
}
