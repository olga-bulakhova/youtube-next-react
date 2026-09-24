import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideosListScreen } from '@/screen/VideoListScreen';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { CATEGORIES, ITEMS_PER_PAGE } from '@/shared/constants';

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ page?: string }>;
};

// Выносим поиск категории в чистую функцию, чтобы не дублировать логику `.find/.some`
const getCategoryByValue = (id: string) =>
  CATEGORIES.find((item) => item.value === id);

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const foundCategory = getCategoryByValue(categoryId);

  return {
    title: foundCategory
      ? `Видео в категории ${foundCategory.label}`
      : 'Категория не найдена',
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // 1. Извлекаем параметры динамического роута параллельно [0.3]
  const [{ categoryId }, { page }] = await Promise.all([params, searchParams]);

  // 2. Оптимизация: Проверяем валидность категории по словарю констант ДО обращения к SQLite
  const currentCategory = getCategoryByValue(categoryId);
  if (!currentCategory) {
    notFound();
  }

  const currentPage = Number(page) || 1;

  // 3. Выполняем пагинированные SQL-запросы к SQLite в параллельном потоке
  const [{ videos, total }, activeCategoriesKeys] = await Promise.all([
    videosDb.getVideosByCategory(categoryId, currentPage, ITEMS_PER_PAGE),
    videosDb.getActiveCategories(),
  ]);

  return (
    <VideosListScreen
      videos={videos}
      totalItems={total}
      itemsPerPage={ITEMS_PER_PAGE}
      activeCategoriesKeys={activeCategoriesKeys}
      category={categoryId} // Передаем ID категории для подсветки активного таба в UI
    />
  );
}
