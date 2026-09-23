import { VideosListScreen } from '@/screen/VideoListScreen';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { ITEMS_PER_PAGE } from '@/shared/constants';

export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
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
