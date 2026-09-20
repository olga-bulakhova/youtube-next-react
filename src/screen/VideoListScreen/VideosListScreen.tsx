
import { CategoriesTabs } from '@/widgets/CategoriesTabs.tsx/CategoriesTabs';
import { VideosGrid } from './VideosGrid';
import { IVideoItem } from '@/app/api/videos/_storage/types';

type VideosListScreenProps = {
  videos: IVideoItem[];
  category?: string;
  basePath?: string;
  userId?: number;
  activeCategoriesKeys: string[];
};

export const VideosListScreen = ({
  videos,
  category = 'all',
  basePath,
  activeCategoriesKeys,
}: VideosListScreenProps) => {
  return (
    <div className="w-full">
      <CategoriesTabs
        activeTab={category}
        basePath={basePath}
        activeCategoriesKeys={activeCategoriesKeys}
      />
      <VideosGrid videos={videos} />
    </div>
  );
};
