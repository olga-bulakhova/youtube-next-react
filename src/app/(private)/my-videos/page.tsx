import { db } from '@/app/api/videos/_storage/videosStorage';
import { VideosListScreen } from '@/screen/VideoListScreen';
import {
  AuthenticatedPageProps,
  withServerAuth,
} from '@/shared/hoc/withServerAuth/withServerAuth';

export const dynamic = 'force-dynamic';

function MyVideosPage({ user }: AuthenticatedPageProps) {
  const { userId } = user;

  const videos = db.getVideosByUserId(userId);
  const activeCategoriesKeys = db.getActiveCategoriesByUserId(userId);

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
