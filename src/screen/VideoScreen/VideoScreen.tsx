'use client';

import { IVideoItem } from '@/app/api/videos/_storage/types';
import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteVideo } from '@/shared/hooks/useDeleteVideo'; // Укажите ваш правильный путь до хука
import { APP_ROUTES } from '@/shared/constants';
import { TrashIcon } from '@/shared/icons';

type VideoScreenProps = {
  video: IVideoItem;
  currentUserId?: number;
};

export const VideoScreen = ({ video, currentUserId }: VideoScreenProps) => {
  const router = useRouter();

  console.log(currentUserId);

  const { deleteVideo, deletingId } = useDeleteVideo(() => {
    router.push(APP_ROUTES.MY_VIDEOS);
  });

  if (!video) return null;

  const isOwner = Number(currentUserId) === Number(video.userId);
  const isDeleting = deletingId === video.videoId;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-6">
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
          <button
            onClick={() => deleteVideo(video.videoId)}
            disabled={isDeleting}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-red-500 hover:bg-red-600 hover:text-white disabled:pointer-events-none disabled:border-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {isDeleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-white" />
                <span>Удаление...</span>
              </>
            ) : (
              <>
                <TrashIcon className="h-4 w-4" />
                <span>Удалить видео</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
