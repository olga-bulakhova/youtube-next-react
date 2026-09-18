'use client';

import { useState } from 'react';
import { IVideoItem } from '@/app/api/_utils';
import { CategoriesTabs } from './CategoriesTabs';
import { VideosGrid } from './VideosGrid';

type HomeScreenProps = {
  videos: IVideoItem[];
  categories: string[];
};

export const HomeScreen = ({ videos, categories }: HomeScreenProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredVideos = videos.filter((video) =>
    activeTab === 'all' ? true : video.category === activeTab,
  );

  return (
    <div className="w-full">
      <CategoriesTabs
        categories={categories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <VideosGrid videos={filteredVideos} />
    </div>
  );
};
