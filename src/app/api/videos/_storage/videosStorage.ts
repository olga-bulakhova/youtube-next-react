import { eq, and, desc, sql, like } from 'drizzle-orm';
import { IVideoItem } from './types';
import { db } from '@/db';
import { videosTable } from '@/db/schema';

export interface PaginatedVideos {
  videos: IVideoItem[];
  total: number;
}

export const videosDb = {
  // Получить все видео (Сортировка: сначала новые)
  getAllVideos: async (
    page: number = 1,
    limit: number = 8,
  ): Promise<PaginatedVideos> => {
    const offset = (page - 1) * limit;

    // Запускаем параллельно получение данных и подсчет общего количества строк
    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: videosTable.category,
          userId: videosTable.userId,
        })
        .from(videosTable)
        .orderBy(desc(videosTable.createdAt))
        .limit(limit) // Ограничиваем выборку [0.4]
        .offset(offset), // Пропускаем предыдущие страницы [0.4]

      db.select({ count: sql<number>`count(*)` }).from(videosTable),
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
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
      titleSearch: video.title.toLowerCase(),
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
  getVideosByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 8,
  ): Promise<PaginatedVideos> => {
    const cleanCategory: string = category.toLowerCase().trim();
    const offset = (page - 1) * limit;

    // Запускаем параллельно получение отфильтрованных данных и подсчет строк для этой категории
    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: videosTable.category, // Возвращено пропущенное поле категории
          userId: videosTable.userId,
        })
        .from(videosTable)
        .where(eq(videosTable.category, cleanCategory)) // Фильтруем строки по категории [0.4]
        .orderBy(desc(videosTable.createdAt))
        .limit(limit) // Ограничиваем выборку под текущую страницу [0.4]
        .offset(offset), // Пропускаем записи прошлых страниц [0.4]

      db
        .select({ count: sql<number>`count(*)` })
        .from(videosTable)
        .where(eq(videosTable.category, cleanCategory)), // 🛡️ ВАЖНО: считаем общее количество видео ТОЛЬКО этой категории [0.4]
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
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
  getVideosByUserId: async (
    userId: number,
    page: number = 1,
    limit: number = 8,
  ): Promise<PaginatedVideos> => {
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
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
        .orderBy(desc(videosTable.createdAt))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)` })
        .from(videosTable)
        .where(eq(videosTable.userId, userId)),
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
  },

  // Получить видео пользователя внутри конкретной категории (Сортировка: сначала новые)
  getVideosByUserIdAndCategory: async (
    userId: number,
    category: string,
    page: number = 1,
    limit: number = 8,
  ): Promise<PaginatedVideos> => {
    const cleanCategory: string = category.toLowerCase().trim();
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: videosTable.category, // Возвращено пропущенное поле категории
          userId: videosTable.userId,
        })
        .from(videosTable)
        .where(eq(videosTable.category, cleanCategory)) // Фильтруем строки по категории [0.4]
        .orderBy(desc(videosTable.createdAt))
        .limit(limit) // Ограничиваем выборку под текущую страницу [0.4]
        .offset(offset), // Пропускаем записи прошлых страниц [0.4]

      db
        .select({ count: sql<number>`count(*)` })
        .from(videosTable)
        .where(
          and(
            eq(videosTable.userId, userId),
            eq(videosTable.category, cleanCategory),
          ),
        ),
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
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

  searchVideos: async (
    query: string,
    limit: number = 11,
  ): Promise<PaginatedVideos> => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return { videos: [], total: 0 };

    const filter = like(videosTable.titleSearch, `%${cleanQuery}%`);

    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: videosTable.category,
          userId: videosTable.userId,
        })
        .from(videosTable)
        .where(filter)
        .orderBy(desc(videosTable.createdAt))
        .limit(limit),

      db
        .select({ count: sql<number>`count(*)` })
        .from(videosTable)
        .where(filter),
    ]);

    const totalCount =
      countResult && countResult[0] ? Number(countResult[0].count) : 0;

    return {
      videos: rows as IVideoItem[],
      total: totalCount,
    };
  },
};
