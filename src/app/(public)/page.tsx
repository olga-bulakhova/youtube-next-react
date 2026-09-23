import Link from 'next/link';
import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { HeroSection } from '@/shared/ui/HeroSection';
import { serverCookies } from '@/shared/utils-server';
import { APP_ROUTES } from '@/shared/constants/routes';
import { VideosGrid } from '@/screen/VideoListScreen/ui/VideosGrid';
import { ITEMS_PER_PAGE } from '@/shared/constants';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await serverCookies.getUser();

  const { videos } = await videosDb.getAllVideos(1, ITEMS_PER_PAGE);

  return (
    <div className="animate-in fade-in w-full pb-12 duration-500">
      <HeroSection user={user} />

      <div className="mx-auto mt-8 max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Свежие поступления в хаб ⚡
          </h2>

          <Link
            href={APP_ROUTES.VIDEOS}
            className="text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
          >
            Смотреть все видео →
          </Link>
        </div>

        {videos.length > 0 ? (
          <VideosGrid videos={videos} />
        ) : (
          <div className="py-12 text-center text-sm text-zinc-500">
            В хабе пока нет добавленных видеороликов.
          </div>
        )}
      </div>
    </div>
  );
}
