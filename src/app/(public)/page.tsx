import { VideosListScreen } from '@/screen/VideoListScreen';
import { db } from '@/app/api/_utils/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const videos = db.getAllVideos();
  const activeCategoriesKeys = db.getActiveCategories();

  return (
    <VideosListScreen
      videos={videos}
      activeCategoriesKeys={activeCategoriesKeys}
    />
  );
}
