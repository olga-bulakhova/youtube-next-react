import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { VideoScreen } from '@/screen/VideoScreen';
import { serverCookies } from '@/shared/utils-server';

export const dynamic = 'force-dynamic';

interface VideoPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const getCachedVideo = cache(async (id: string) => {
  return await videosDb.getVideoById(id);
});

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { videoId } = await params;

  const video = await getCachedVideo(videoId);

  if (!video) {
    notFound();
  }

  return {
    title: video.title,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;
  const user = await serverCookies.getUser();
  const video = await getCachedVideo(videoId);

  if (!video) {
    notFound();
  }

  return <VideoScreen video={video} currentUserId={user?.id} />;
}
