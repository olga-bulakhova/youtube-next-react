import { IVideoItem } from '@/app/api/videos/_storage/types';
import { APP_ROUTES } from '@/shared/constants';
import { TrashIcon } from '@/shared/icons';
import Image from 'next/image';
import Link from 'next/link';

interface VideoItemProps {
  video: IVideoItem;
  showDeleteButton: boolean;
  isDeleting: boolean;
  onDelete: (videoId: string) => Promise<void>;
}

export const VideoItem = ({
  video,
  showDeleteButton,
  isDeleting,
  onDelete,
}: VideoItemProps) => {
  return (
    <div className="group relative w-full rounded-xl p-3 shadow-lg transition-colors hover:bg-zinc-800/50">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Link
          href={APP_ROUTES.VIDEO(video.videoId)}
          className="relative block h-full w-full"
        >
          <Image
            src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.title}
            unoptimized
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
            className="object-cover transition-transform duration-300"
            priority={true}
          />
        </Link>

        {showDeleteButton && (
          <button
            onClick={() => onDelete(video.videoId)}
            disabled={isDeleting}
            className={`absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/70 text-zinc-400 transition-all hover:bg-red-600 hover:text-white disabled:bg-zinc-700 disabled:text-zinc-500 ${
              isDeleting
                ? 'pointer-events-none opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
            title="Удалить видео"
          >
            {isDeleting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-white" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={APP_ROUTES.VIDEO(video.videoId)}
          target="_blank"
          className="line-clamp-2 text-sm font-medium text-zinc-100 transition-colors"
        >
          {video.title}
        </Link>
        <Link
          href={video.authorUrl}
          className="w-fit text-xs text-zinc-400 hover:text-zinc-200"
        >
          {video.authorName}
        </Link>
      </div>
    </div>
  );
};
