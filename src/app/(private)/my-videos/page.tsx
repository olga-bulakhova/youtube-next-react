import { db } from '@/app/api/videos/_storage/videosStorage';
import { VideosListScreen } from '@/screen/VideoListScreen';
import { requireServerAuth } from '@/shared/server';

export const dynamic = 'force-dynamic';

export default async function MyVideosPage() {
  const { userId } = await requireServerAuth();
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
