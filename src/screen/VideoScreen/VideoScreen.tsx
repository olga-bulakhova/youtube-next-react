import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import Link from 'next/link';

type VideoScreenProps = {
  videoId: string;
};

export const VideoScreen = ({ videoId }: VideoScreenProps) => {
  if (!videoId) return null;

  return (
    <>
      <YouTubePlayer videoId={videoId} autoplay />

      <div className="mt-3">
        <h2 className="mb-2 text-2xl font-bold">Название ролика</h2>
        <Link href={`/`} className="text-zinc block" style={{}}>
          Название канала
        </Link>
      </div>
    </>
  );
};
