import { IVideoItem } from '@/app/api/videos/_storage/types';
import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import Link from 'next/link';

type VideoScreenProps = {
  video: IVideoItem;
};

export const VideoScreen = ({ video }: VideoScreenProps) => {
  if (!video) return null;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <YouTubePlayer videoId={video.videoId} autoplay />

      <div className="mt-4">
        <h2 className="text-l mb-2 font-bold text-white sm:text-2xl">
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
    </div>
  );
};
