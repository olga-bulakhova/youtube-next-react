'use client';

import { IVideoItem } from '@/app/api/videos/_storage/types';
import { APP_ROUTES } from '@/shared/constants';
import { usePathname } from 'next/navigation';
import { VideoItem } from './VideoItem';
import { useDeleteVideo } from '../model/useDeleteVideo';

interface VideosGridProps {
  videos: IVideoItem[];
  userId?: number;
}

export const VideosGrid = ({ videos }: VideosGridProps) => {
  const pathname = usePathname();
  const isMyVideosTab = pathname.startsWith(APP_ROUTES.MY_VIDEOS);
  const { deleteVideo, deletingId } = useDeleteVideo();

  if (videos.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        Нет видео в выбранной категории
      </div>
    );
  }

  return (
    <div className="mx-auto grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoItem
          key={video.videoId}
          video={video}
          showDeleteButton={isMyVideosTab}
          isDeleting={deletingId === video.videoId}
          onDelete={deleteVideo}
        />
      ))}
    </div>
  );
};
