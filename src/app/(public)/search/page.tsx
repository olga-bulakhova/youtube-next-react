import { videosDb } from '@/app/api/videos/_storage/videosStorage';
import { ITEMS_PER_PAGE } from '@/shared/constants';
import { Metadata } from 'next';
import { VideosGrid } from '@/screen/VideoListScreen/ui/VideosGrid';
import { Pagination } from '@/shared/ui/Pagination';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.search?.trim() || '';
  return {
    title: query ? `Результаты поиска: «${query}»` : 'Поиск видео',
  };
}

interface SearchPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const searchQuery = params.search?.trim() || '';
  const currentPage = Number(params.page) || 1;

  const { videos, total } = await videosDb.searchVideos(
    currentPage,
    searchQuery,
    ITEMS_PER_PAGE,
  );

  return (
    <>
      <VideosGrid videos={videos} />
      <Pagination totalItems={total} itemsPerPage={ITEMS_PER_PAGE} />
    </>
  );
}
