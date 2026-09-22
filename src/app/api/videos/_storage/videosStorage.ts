import { eq, and } from 'drizzle-orm';
import { IVideoItem } from './types';
import { db } from '@/db';
import { videosTable } from '@/db/schema';

export const videosDb = {
  // Получить все видео
  getAllVideos: async (): Promise<IVideoItem[]> => {
    // Явно типизируем возвращаемый из базы данных массив строк
    const rows: IVideoItem[] = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: videosTable.category,
        userId: videosTable.userId,
      })
      .from(videosTable);

    return rows;
  },

  // Проверить, существует ли видео
  hasVideo: async (videoId: string): Promise<boolean> => {
    const rows: { id: string }[] = await db
      .select({ id: videosTable.videoId })
      .from(videosTable)
      .where(eq(videosTable.videoId, videoId))
      .limit(1);

    return rows.length > 0;
  },

  // Добавить новое видео
  addVideo: async (
    videoId: string,
    video: Omit<IVideoItem, 'videoId'>,
  ): Promise<void> => {
    await db.insert(videosTable).values({
      videoId: videoId,
      title: video.title,
      authorName: video.authorName,
      authorUrl: video.authorUrl,
      category: video.category,
      userId: video.userId,
    });
  },

  // Получить список уникальных категорий, в которых есть видео
  getActiveCategories: async (): Promise<string[]> => {
    const rows: { category: string }[] = await db
      .selectDistinct({ category: videosTable.category })
      .from(videosTable);

    // Явно указываем тип аргумента в .map()
    return rows.map((row: { category: string }): string => row.category);
  },

  // Получить видео по определенной категории (регистронезависимо через LIKE)
  getVideosByCategory: async (category: string): Promise<IVideoItem[]> => {
    const cleanCategory: string = category.toLowerCase().trim();

    const rows: IVideoItem[] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.category, cleanCategory));

    return rows;
  },

  // Получить конкретное видео по его ID
  getVideoById: async (videoId: string): Promise<IVideoItem | undefined> => {
    const rows: IVideoItem[] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.videoId, videoId))
      .limit(1);

    return rows[0];
  },

  // Получить все видео конкретного пользователя
  getVideosByUserId: async (userId: number): Promise<IVideoItem[]> => {
    const rows: IVideoItem[] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.userId, userId));

    return rows;
  },

  // Получить видео пользователя внутри конкретной категории
  getVideosByUserIdAndCategory: async (
    userId: number,
    category: string,
  ): Promise<IVideoItem[]> => {
    const cleanCategory: string = category.toLowerCase().trim();

    const rows: IVideoItem[] = await db
      .select()
      .from(videosTable)
      .where(
        and(
          eq(videosTable.userId, userId),
          eq(videosTable.category, cleanCategory),
        ),
      );

    return rows;
  },

  // Получить только те категории, в которых есть видео этого пользователя
  getActiveCategoriesByUserId: async (userId: number): Promise<string[]> => {
    const rows: { category: string }[] = await db
      .selectDistinct({ category: videosTable.category })
      .from(videosTable)
      .where(eq(videosTable.userId, userId));

    // Явно указываем тип аргумента и возвращаемого значения в .map()
    return rows.map((row: { category: string }): string => row.category);
  },
};
