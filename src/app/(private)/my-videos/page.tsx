import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { VideosListScreen } from '@/screen/VideoListScreen';
import {
  AuthenticatedPageProps,
  withServerAuth,
} from '@/shared/hoc/withServerAuth/withServerAuth';

export const dynamic = 'force-dynamic';

async function MyVideosPage({ user }: AuthenticatedPageProps) {
  const { userId } = user;

  const [videos, activeCategoriesKeys] = await Promise.all([
    videosDb.getVideosByUserId(userId),
    videosDb.getActiveCategoriesByUserId(userId),
  ]);

  return (
    <VideosListScreen
      videos={videos}
      basePath="/my-videos"
      activeCategoriesKeys={activeCategoriesKeys}
      userId={userId}
    />
  );
}

export default withServerAuth(MyVideosPage);
