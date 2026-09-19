import { IVideoItem } from '@/app/api/_utils';
import { CategoriesTabs } from '@/widgets/CategoriesTabs.tsx/CategoriesTabs';
import { VideosGrid } from './VideosGrid';

type HomeScreenProps = {
  videos: IVideoItem[];
  category?: string;
};

export const VideosListScreen = ({
  videos,
  category = 'all',
}: HomeScreenProps) => {
  return (
    <div className="w-full">
      <CategoriesTabs activeTab={category} />
      <VideosGrid videos={videos} />
    </div>
  );
};
