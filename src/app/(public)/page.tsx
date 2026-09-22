import { VideosListScreen } from '@/screen/VideoListScreen';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [videos, activeCategoriesKeys] = await Promise.all([
    videosDb.getAllVideos(),
    videosDb.getActiveCategories(),
  ]);

  return (
    <VideosListScreen
      videos={videos}
      activeCategoriesKeys={activeCategoriesKeys}
    />
  );
}
