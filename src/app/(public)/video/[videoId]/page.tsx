import { notFound } from 'next/navigation';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { serverCookies } from '@/shared/utils-server';
import { VideoScreen } from '@/screen/VideoScreen';
import { Metadata } from 'next';

type VideoPageProps = {
  params: Promise<{ videoId: string }>;
};

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { videoId } = await params;
  const video = await videosDb.getVideoById(videoId);

  return {
    title: video ? video.title : 'Видео не найдено',
    description: video
      ? `Смотреть видео "${video.title}" от автора ${video.authorName} в чистом изолированном хабе без рекламы.`
      : undefined,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;
  const video = await videosDb.getVideoById(videoId);
  if (!video) {
    notFound();
  }

  const user = await serverCookies.getUser();
  const isAuthorized = !!user && !!user.id;

  const isAddedToMyCollection = isAuthorized
    ? await videosDb.hasVideoInCollection(videoId, user.id)
    : false;

  return (
    <VideoScreen
      video={video}
      isAuthorized={isAuthorized}
      isAddedToMyCollection={isAddedToMyCollection}
    />
  );
}
