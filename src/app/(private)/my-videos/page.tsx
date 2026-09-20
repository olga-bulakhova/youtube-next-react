import { db } from '@/app/api/_utils/storage';
import { VideosListScreen } from '@/screen/VideoListScreen';
export const dynamic = 'force-dynamic';

export default async function MyVideosPage() {
  const userId = 2;

  const videos = db.getVideosByUserId(userId);
  const activeCategoriesKeys = db.getActiveCategoriesByUserId(userId);

  return (
    <VideosListScreen
      videos={videos}
      basePath="/my-videos"
      activeCategoriesKeys={activeCategoriesKeys}
    />
  );
}
