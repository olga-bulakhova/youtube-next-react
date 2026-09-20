import { IVideoItem } from '@/app/api/_utils';
import { CategoriesTabs } from '@/widgets/CategoriesTabs.tsx/CategoriesTabs';
import { VideosGrid } from './VideosGrid';

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
