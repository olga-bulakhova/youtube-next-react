'use client';

import { IVideoItem } from '@/app/api/videos/_storage/types';
import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteVideo } from '@/shared/hooks/useDeleteVideo';
import { APP_ROUTES } from '@/shared/constants';
import { TrashIcon } from '@/shared/icons';
import { Button } from '@/shared/ui/Button'; // Импортируем нашу универсальную кнопку
import { BackButton } from '@/shared/ui/BackButton';

type VideoScreenProps = {
  video: IVideoItem;
  currentUserId?: number;
};

export const VideoScreen = ({ video, currentUserId }: VideoScreenProps) => {
  const router = useRouter();

  const { deleteVideo, deletingId } = useDeleteVideo(() => {
    router.push(APP_ROUTES.MY_VIDEOS);
  });

  if (!video) return null;

  const isOwner = Number(currentUserId) === Number(video.userId);
  const isDeleting = deletingId === video.videoId;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-6">
      <BackButton className='mb-4' />

      <YouTubePlayer videoId={video.videoId} autoplay />

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
            {video.title}
          </h2>
          <Link
            href={video.authorUrl || '#'}
            className="block w-fit text-sm text-zinc-400 hover:text-zinc-200 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.authorName}
          </Link>
        </div>

        {isOwner && (
          <Button
            onClick={() => deleteVideo(video.videoId)}
            isLoading={isDeleting}
            loadingText="Удаление..."
            variant="danger"
            icon={<TrashIcon className="h-4 w-4" />}
          >
            Удалить видео
          </Button>
        )}
      </div>
    </div>
  );
};
