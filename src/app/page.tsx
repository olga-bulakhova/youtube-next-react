import { HomeScreen } from '@/screen/HomeScreen';
import { db } from '@/app/api/_utils/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const videos = db.getAllVideos();
  const categories = db.getActiveCategories();

  return <HomeScreen videos={videos} categories={categories} />;
}
