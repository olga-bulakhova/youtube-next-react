import { IVideoItem } from './types';

declare global {
  var prismaMockVideosMap: Map<string, IVideoItem> | undefined;
}

const videosMap =
  globalThis.prismaMockVideosMap ??
  new Map<string, IVideoItem>([
    [
      'teEcuWCtySk',
      {
        videoId: 'teEcuWCtySk',
        title: 'Вся правда про Next.js',
        authorName: 'Разработчик',
        authorUrl: 'https://youtube.com',
        category: 'tech',
      },
    ],
  ]);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaMockVideosMap = videosMap;
}

export const db = {
  getAllVideos: (): IVideoItem[] => {
    return Array.from(videosMap.values());
  },

  hasVideo: (videoId: string): boolean => {
    return videosMap.has(videoId);
  },

  addVideo: (videoId: string, video: IVideoItem): void => {
    videosMap.set(videoId, video);
  },

  getActiveCategories: (): string[] => {
    return [
      ...new Set(Array.from(videosMap.values(), (video) => video.category)),
    ];
  },

  getVideosByCategory: (category: string): IVideoItem[] => {
    const cleanCategory = category.toLowerCase().trim();

    return Array.from(videosMap.values()).filter(
      (video) => video.category.toLowerCase().trim() === cleanCategory,
    );
  },

  getVideoById: (videoId: string): IVideoItem | undefined => {
    return videosMap.get(videoId);
  },
};
