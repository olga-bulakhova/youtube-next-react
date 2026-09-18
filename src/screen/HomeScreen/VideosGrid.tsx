import Image from 'next/image';
import Link from 'next/link';
import { IVideoItem } from '@/app/api/_utils';

interface VideosGridProps {
  videos: IVideoItem[];
}

export const VideosGrid = ({ videos }: VideosGridProps) => {
  if (videos.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        Нет видео в выбранной категории
      </div>
    );
  }

  return (
    <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <div
          key={video.videoId}
          className="group relative w-full rounded-xl p-3 shadow-lg transition-colors hover:bg-zinc-800/50"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Link
              href={`/video/${video.videoId}`}
              className="relative block h-full w-full"
            >
              <Image
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={video.title}
                unoptimized
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                className="object-cover transition-transform duration-300"
                preload={true}
              />
            </Link>
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <Link
              href={`/video/${video.videoId}`}
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
      ))}
    </div>
  );
};
