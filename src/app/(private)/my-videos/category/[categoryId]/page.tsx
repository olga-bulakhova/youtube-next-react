import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideosListScreen } from '@/screen/VideoListScreen';
import { db } from '@/app/api/videos/_storage/videosStorage';
import { CATEGORIES } from '@/shared/constants';
import { requireServerAuth } from '@/shared/server';


type MyVideosCategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export async function generateMetadata({
  params,
}: MyVideosCategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const foundCategory = CATEGORIES.find((item) => item.value === categoryId);

  return {
    title: foundCategory
      ? `Видео в категории ${foundCategory.label}`
      : 'Категория не найдена',
  };
}

export default async function MyVideosCategoryPage({
  params,
}: MyVideosCategoryPageProps) {
  const { categoryId } = await params;
  const isCategoryValid = CATEGORIES.some((item) => item.value === categoryId);

  const { userId } = await requireServerAuth();

  if (!isCategoryValid) {
    notFound();
  }

  const videos = db.getVideosByUserIdAndCategory(userId, categoryId);
  const activeCategoriesKeys = db.getActiveCategoriesByUserId(userId);

  return (
    <VideosListScreen
      videos={videos}
      category={categoryId}
      basePath="/my-videos"
      activeCategoriesKeys={activeCategoriesKeys}
    />
  );
}
