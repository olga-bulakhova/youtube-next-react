import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/app/api/videos/_storage/videosStorage';
import { VideoScreen } from '@/screen/VideoScreen';

export const dynamic = 'force-dynamic';

interface VideoPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const getCachedVideo = cache((id: string) => {
  return db.getVideoById(id);
});

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { videoId } = await params;
  const video = getCachedVideo(videoId);

  if (!video) {
    notFound();
  }

  return {
    title: video.title,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;
  const video = getCachedVideo(videoId);

  // Проверка дублируется как страховочный слой для TypeScript (type guard)
  if (!video) {
    notFound();
  }

  return <VideoScreen video={video} />;
}
