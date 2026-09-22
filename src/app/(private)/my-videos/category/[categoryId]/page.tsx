import type { Metadata } from 'next';
import { notFound } from 'next/navigation'; // Нативный 404 прерыватель Next.js [0.3]
import { VideosListScreen } from '@/screen/VideoListScreen';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { CATEGORIES } from '@/shared/constants';
import {
  AuthenticatedPageProps,
  withServerAuth,
} from '@/shared/hoc/withServerAuth/withServerAuth';

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

async function MyVideosCategoryPage({
  params,
  user,
}: MyVideosCategoryPageProps & AuthenticatedPageProps) {
  const { categoryId } = await params;

  const { userId } = user;

  const isCategoryValid = CATEGORIES.some((item) => item.value === categoryId);

  if (!isCategoryValid) {
    notFound();
  }

  const [videos, activeCategoriesKeys] = await Promise.all([
    videosDb.getVideosByUserIdAndCategory(userId, categoryId),
    videosDb.getActiveCategoriesByUserId(userId),
  ]);

  return (
    <VideosListScreen
      videos={videos}
      category={categoryId}
      basePath="/my-videos"
      activeCategoriesKeys={activeCategoriesKeys}
      userId={userId}
    />
  );
}

export default withServerAuth(MyVideosCategoryPage);
