import { VideosListScreen } from '@/screen/VideoListScreen';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { ITEMS_PER_PAGE } from '@/shared/constants';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type AllVideosPageProps = {
  searchParams: Promise<{ page?: string }>;
};


export const metadata: Metadata = {
  title: 'Общая Видеотека | Личный Видео-Хаб',
  description:
    'Глобальный каталог полезных видеоматериалов, лекций и туториалов, собранный пользователями хаба. Полная свобода от навязчивых алгоритмов.',
};

export default async function AllVideosPage({ searchParams }: AllVideosPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [{ videos, total }, activeCategoriesKeys] = await Promise.all([
    videosDb.getAllVideos(currentPage, ITEMS_PER_PAGE),
    videosDb.getActiveCategories(),
  ]);

  return (
    <div className="w-full">
      <VideosListScreen
        videos={videos}
        totalItems={total}
        itemsPerPage={ITEMS_PER_PAGE}
        activeCategoriesKeys={activeCategoriesKeys}
      />
    </div>
  );
}
