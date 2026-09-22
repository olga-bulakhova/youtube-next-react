import { eq, and, desc } from 'drizzle-orm'; // Добавлен импорт desc
import { IVideoItem } from './types';
import { db } from '@/db';
import { videosTable } from '@/db/schema';

export const videosDb = {
  // Получить все видео (Сортировка: сначала новые)
  getAllVideos: async (): Promise<IVideoItem[]> => {
    const rows: IVideoItem[] = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: videosTable.category,
        userId: videosTable.userId,
      })
      .from(videosTable)
      .orderBy(desc(videosTable.createdAt)); // Добавлено упорядочивание

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

    return rows.map((row: { category: string }): string => row.category);
  },

  // Получить видео по определенной категории (Сортировка: сначала новые)
  getVideosByCategory: async (category: string): Promise<IVideoItem[]> => {
    const cleanCategory: string = category.toLowerCase().trim();

    const rows = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: videosTable.category,
        userId: videosTable.userId,
      })
      .from(videosTable)
      .where(eq(videosTable.category, cleanCategory))
      .orderBy(desc(videosTable.createdAt)); // Добавлено упорядочивание

    return rows as IVideoItem[];
  },

  // Получить конкретное видео по его ID
  getVideoById: async (videoId: string): Promise<IVideoItem | undefined> => {
    const rows = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: videosTable.category,
        userId: videosTable.userId,
      })
      .from(videosTable)
      .where(eq(videosTable.videoId, videoId))
      .limit(1);

    return rows[0] as IVideoItem | undefined;
  },

  // Получить все видео конкретного пользователя (Сортировка: сначала новые)
  getVideosByUserId: async (userId: number): Promise<IVideoItem[]> => {
    const rows = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: videosTable.category,
        userId: videosTable.userId,
      })
      .from(videosTable)
      .where(eq(videosTable.userId, userId))
      .orderBy(desc(videosTable.createdAt)); // Добавлено упорядочивание

    return rows as IVideoItem[];
  },

  // Получить видео пользователя внутри конкретной категории (Сортировка: сначала новые)
  getVideosByUserIdAndCategory: async (
    userId: number,
    category: string,
  ): Promise<IVideoItem[]> => {
    const cleanCategory: string = category.toLowerCase().trim();

    const rows = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: videosTable.category,
        userId: videosTable.userId,
      })
      .from(videosTable)
      .where(
        and(
          eq(videosTable.userId, userId),
          eq(videosTable.category, cleanCategory),
        ),
      )
      .orderBy(desc(videosTable.createdAt)); // Добавлено упорядочивание

    return rows as IVideoItem[];
  },

  // Получить только те категории, в которых есть видео этого пользователя
  getActiveCategoriesByUserId: async (userId: number): Promise<string[]> => {
    const rows: { category: string }[] = await db
      .selectDistinct({ category: videosTable.category })
      .from(videosTable)
      .where(eq(videosTable.userId, userId));

    return rows.map((row: { category: string }): string => row.category);
  },

  deleteVideo: async (videoId: string, userId: number): Promise<boolean> => {
    // Удаляем видео только в том случае, если совпадают и ID видео, и ID автора
    const result = await db
      .delete(videosTable)
      .where(
        and(eq(videosTable.videoId, videoId), eq(videosTable.userId, userId)),
      );

    // Возвращаем true, если запись была успешно удалена
    return true;
  },
};
