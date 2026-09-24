import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideosListScreen } from '@/screen/VideoListScreen';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { CATEGORIES, ITEMS_PER_PAGE } from '@/shared/constants';
import {
  AuthenticatedPageProps,
  withServerAuth,
} from '@/shared/hoc/withServerAuth/withServerAuth';

type MyVideosCategoryPageProps = AuthenticatedPageProps & {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: Omit<MyVideosCategoryPageProps, 'user'>): Promise<Metadata> {
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
  searchParams,
}: MyVideosCategoryPageProps) {
  const [{ categoryId }, { page }] = await Promise.all([params, searchParams]);
  const isCategoryValid = CATEGORIES.some((item) => item.value === categoryId);
  if (!isCategoryValid) {
    notFound();
  }

  const { userId } = user;
  const currentPage = Number(page) || 1;

  const [{ videos, total }, activeCategoriesKeys] = await Promise.all([
    videosDb.getMyVideosByCategory(
      userId,
      categoryId,
      currentPage,
      ITEMS_PER_PAGE,
    ),
    videosDb.getActiveCategoriesByUserId(userId),
  ]);

  return (
    <VideosListScreen
      videos={videos}
      totalItems={total}
      category={categoryId}
      itemsPerPage={ITEMS_PER_PAGE}
      basePath="/my-videos"
      activeCategoriesKeys={activeCategoriesKeys}
      userId={userId}
    />
  );
}

export default withServerAuth(MyVideosCategoryPage);
