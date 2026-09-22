import { CategoriesTabs } from '@/widgets/CategoriesTabs.tsx/CategoriesTabs';
import { VideosGrid } from './VideosGrid';
import { IVideoItem } from '@/app/api/videos/_storage/types';
import { Pagination } from '@/shared/ui/Pagination';

type VideosListScreenProps = {
  videos: IVideoItem[];
  category?: string;
  basePath?: string;
  userId?: number;
  activeCategoriesKeys: string[];
  totalItems: number;
  itemsPerPage: number;
};

export const VideosListScreen = ({
  videos,
  category = 'all',
  basePath,
  activeCategoriesKeys,
  totalItems,
  itemsPerPage,
}: VideosListScreenProps) => {
  return (
    <div className="flex h-full min-h-[calc(100vh-110px)] w-full flex-col">
      <CategoriesTabs
        activeTab={category}
        basePath={basePath}
        activeCategoriesKeys={activeCategoriesKeys}
      />

      <div className="flex-1 overflow-y-auto">
        <VideosGrid videos={videos} />
      </div>

      <Pagination totalItems={totalItems} itemsPerPage={itemsPerPage} />
    </div>
  );
};
