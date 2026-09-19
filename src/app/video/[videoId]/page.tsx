import { notFound } from 'next/navigation';
import { db } from '@/app/api/_utils/storage'; // Ваше singleton-хранилище
import { VideoScreen } from '@/screen/VideoScreen';

export const dynamic = 'force-dynamic';

interface VideoPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;

  const video = db.getVideoById(videoId);

  if (!video) {
    notFound();
  }

  return <VideoScreen video={video} />;
}
