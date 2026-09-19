import { VideosListScreen } from '@/screen/VideoListScreen';
import { db } from '@/app/api/_utils/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const videos = db.getAllVideos();

  return <VideosListScreen videos={videos} />;
}
