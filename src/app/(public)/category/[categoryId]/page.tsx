import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideosListScreen } from '@/screen/VideoListScreen';
import { db } from '@/app/api/_utils/storage';
import { CATEGORIES } from '@/shared/constants';

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const foundCategory = CATEGORIES.find((item) => item.value === categoryId);

  return {
    title: foundCategory
      ? `Видео в категории ${foundCategory.label}`
      : 'Категория не найдена',
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const isCategoryValid = CATEGORIES.some((item) => item.value === categoryId);
  const activeCategoriesKeys = db.getActiveCategories();

  if (!isCategoryValid) {
    notFound();
  }

  const videos = db.getVideosByCategory(categoryId);
  return (
    <VideosListScreen
      videos={videos}
      category={categoryId}
      activeCategoriesKeys={activeCategoriesKeys}
    />
  );
}
