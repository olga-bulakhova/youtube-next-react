import { IVideoItem } from './types';

declare global {
  var prismaMockVideosMap: Map<string, IVideoItem> | undefined;
}

const videosMap =
  globalThis.prismaMockVideosMap ??
  new Map<string, IVideoItem>([
    [
      '4qcPopWKJlQ',
      {
        videoId: '4qcPopWKJlQ',
        title: 'Вся правда про Next.js',
        authorName: 'Разработчик',
        authorUrl: 'https://youtube.com',
        category: 'tech',
        userId: 1,
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

  getVideosByUserId: (userId: number): IVideoItem[] => {
    return Array.from(videosMap.values()).filter(
      (video) => video.userId === userId,
    );
  },

  getVideosByUserIdAndCategory: (
    userId: number,
    category: string,
  ): IVideoItem[] => {
    const cleanCategory = category.toLowerCase().trim();

    return Array.from(videosMap.values()).filter(
      (video) =>
        video.userId === userId &&
        video.category.toLowerCase().trim() === cleanCategory,
    );
  },

  getActiveCategoriesByUserId: (userId: number): string[] => {
    const userVideos = Array.from(videosMap.values()).filter(
      (video) => video.userId === userId,
    );

    const uniqueUserCategories = userVideos.map((video) => video.category);

    return [...new Set(uniqueUserCategories)];
  },
};
