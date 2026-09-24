import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { VideosListScreen } from '@/screen/VideoListScreen';
import {
  withServerAuth,
  AuthenticatedPageProps,
} from '@/shared/hoc/withServerAuth/withServerAuth'; // Используем ваш готовый интерфейс [0.3]
import { ITEMS_PER_PAGE } from '@/shared/constants';

export const dynamic = 'force-dynamic';

type MyVideosPageProps = AuthenticatedPageProps & {
  searchParams: Promise<{ page?: string }>;
};

async function MyVideosPage({ user, searchParams }: MyVideosPageProps) {
  const { userId } = user;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const [{ videos, total }, activeCategoriesKeys] = await Promise.all([
    videosDb.getMyVideos(userId, currentPage, ITEMS_PER_PAGE),
    videosDb.getActiveCategoriesByUserId(userId),
  ]);

  return (
    <VideosListScreen
      videos={videos}
      basePath="/my-videos"
      activeCategoriesKeys={activeCategoriesKeys}
      userId={userId}
      totalItems={total}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}

export default withServerAuth(MyVideosPage);
