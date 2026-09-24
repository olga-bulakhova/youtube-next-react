import { eq, and, desc, sql, like } from 'drizzle-orm';
import { db } from '@/db';
import { videosTable, userCollectionsTable } from '@/db/schema';
import { IVideoItem, PaginatedVideos } from './types'; // Убедитесь, что пути к типам верны

export const videosDb = {
  /**
   * 🗺️ 1. ОБЩАЯ ВИДЕТЕКА: Получить все уникальные видео на сайте (с пагинацией)
   */
  getAllVideos: async (
    page: number = 1,
    limit: number = 12,
  ): Promise<PaginatedVideos> => {
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          // В общем списке дефолтно отдаем пустую категорию, либо базовую
          category: sql<string>`'all'`,
        })
        .from(videosTable)
        .orderBy(desc(videosTable.createdAt))
        .limit(limit)
        .offset(offset),

      db.select({ count: sql<number>`count(*)` }).from(videosTable),
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
  },

  /**
   * 🗺️ ГЛОБАЛЬНАЯ КАТЕГОРИЯ: Получить все уникальные видео на сайте внутри конкретной категории
   * 🌟 ИСПРАВЛЕНО: Переведено на Many-to-Many схему с группировкой, чтобы избежать дублей роликов
   */
  getVideosByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 12,
  ): Promise<PaginatedVideos> => {
    const cleanCategory = category.toLowerCase().trim();
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          // Отдаем ту категорию, по которой искали
          category: sql<string>`${cleanCategory}`,
        })
        .from(userCollectionsTable)
        // Склеиваем с метаданными видео [0.2]
        .innerJoin(
          videosTable,
          eq(userCollectionsTable.videoId, videosTable.videoId),
        )
        .where(eq(userCollectionsTable.category, cleanCategory))
        // 🛡️ ВАЖНО: Группируем по videoId, чтобы одно видео не вывелось несколько раз,
        // если его добавили разные пользователи в одну категорию!
        .groupBy(videosTable.videoId)
        .orderBy(desc(videosTable.createdAt))
        .limit(limit)
        .offset(offset),

      // Считаем общее количество УНИКАЛЬНЫХ видео в этой категории на всем сайте
      db
        .select({
          count: sql<number>`count(distinct ${userCollectionsTable.videoId})`,
        })
        .from(userCollectionsTable)
        .where(eq(userCollectionsTable.category, cleanCategory)),
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
  },

  /**
   * 🔒 2. ВАШИ ВИДЕО: Получить видео конкретного пользователя с помощью INNER JOIN [0.2]
   */
  getMyVideos: async (
    userId: number,
    page: number = 1,
    limit: number = 12,
  ): Promise<PaginatedVideos> => {
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: userCollectionsTable.category, // Категория берется из персональной коллекции!
        })
        .from(userCollectionsTable)
        // Склеиваем таблицы по совпадению videoId [0.2]
        .innerJoin(
          videosTable,
          eq(userCollectionsTable.videoId, videosTable.videoId),
        )
        .where(eq(userCollectionsTable.userId, userId))
        .orderBy(desc(userCollectionsTable.createdAt))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)` })
        .from(userCollectionsTable)
        .where(eq(userCollectionsTable.userId, userId)),
    ]);

    return {
      videos: rows as unknown as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
  },

  /**
   * 🗂️ ПЕРСОНАЛЬНАЯ КАТЕГОРИЯ: Получить видео конкретного пользователя внутри определенной категории
   * 🌟 ИСПРАВЛЕНО: Переведено на Many-to-Many схему с использованием INNER JOIN [0.2]
   */
  getMyVideosByCategory: async (
    userId: number,
    category: string,
    page: number = 1,
    limit: number = 12,
  ): Promise<PaginatedVideos> => {
    const cleanCategory = category.toLowerCase().trim();
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: userCollectionsTable.category, // Категория берется из персональной связи
        })
        .from(userCollectionsTable)
        // Склеиваем таблицы по идентификатору видео [0.2]
        .innerJoin(
          videosTable,
          eq(userCollectionsTable.videoId, videosTable.videoId),
        )
        .where(
          and(
            eq(userCollectionsTable.userId, userId),
            eq(userCollectionsTable.category, cleanCategory),
          ),
        )
        .orderBy(desc(userCollectionsTable.createdAt)) // Сначала новые добавленные связи
        .limit(limit)
        .offset(offset),

      // Точный подсчет общего количества видео в этой категории у конкретного юзера
      db
        .select({ count: sql<number>`count(*)` })
        .from(userCollectionsTable)
        .where(
          and(
            eq(userCollectionsTable.userId, userId),
            eq(userCollectionsTable.category, cleanCategory),
          ),
        ),
    ]);

    return {
      videos: rows as unknown as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
  },

  getVideoById: async (videoId: string): Promise<IVideoItem | undefined> => {
    const rows = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: sql<string>`'all'`,
      })
      .from(videosTable)
      .where(eq(videosTable.videoId, videoId))
      .limit(1);

    return rows[0] as IVideoItem | undefined;
  },

  /**
   * ➕ 3. ДОБАВЛЕНИЕ/ШАРИНГ ВИДЕО УМНЫМ СПОСОБОМ
   */
  addVideo: async (
    videoId: string,
    payload: {
      title: string;
      authorName: string;
      authorUrl: string;
      category: string;
      userId: number;
    },
  ): Promise<void> => {
    // Проверяем, существует ли уже вообще такое видео в глобальной таблице метаданных [1.0]
    const [existingVideo] = await db
      .select({ videoId: videosTable.videoId })
      .from(videosTable)
      .where(eq(videosTable.videoId, videoId))
      .limit(1);

    // Если видео добавляется на сайт ВПЕРВЫЕ — создаем строку в videosTable [1.0]
    if (!existingVideo) {
      await db.insert(videosTable).values({
        videoId,
        title: payload.title,
        authorName: payload.authorName,
        authorUrl: payload.authorUrl,
        titleSearch: payload.title.toLowerCase().trim(),
      });
    }

    // В обязательном порядке создаем связь в коллекции конкретного пользователя [1.0]
    await db.insert(userCollectionsTable).values({
      userId: payload.userId,
      videoId: videoId,
      category: payload.category.toLowerCase().trim(),
    });
  },

  /**
   * 🛡️ 4. ПРОВЕРКА: Добавлено ли это видео КОНКРЕТНЫМ пользователем к себе в коллекцию? [1.0]
   */
  hasVideoInCollection: async (
    videoId: string,
    userId: number,
  ): Promise<boolean> => {
    const rows = await db
      .select({ id: userCollectionsTable.id })
      .from(userCollectionsTable)
      .where(
        and(
          eq(userCollectionsTable.videoId, videoId),
          eq(userCollectionsTable.userId, userId),
        ),
      )
      .limit(1);

    return rows.length > 0;
  },

  /**
   * 🗑️ 5. УДАЛЕНИЕ: Стирает связь видео с пользователем.
   * 🌟 ОБНОВЛЕНО: Если видео больше не привязано ни к одному клиенту — оно полностью удаляется из системы! [0.3]
   */
  deleteVideoFromCollection: async (
    videoId: string,
    userId: number,
  ): Promise<void> => {
    // Оборачиваем операцию в транзакцию, чтобы всё выполнилось атомарно и безопасно 🛡️
    await db.transaction(async (tx) => {
      // Шаг 1: Удаляем связь конкретного текущего пользователя с этим видеороликом [0.3]
      await tx
        .delete(userCollectionsTable)
        .where(
          and(
            eq(userCollectionsTable.videoId, videoId),
            eq(userCollectionsTable.userId, userId),
          ),
        );

      // Шаг 2: Проверяем, держит ли ещё кто-то на сайте этот ролик в своей коллекции
      const [remainingConnections] = await tx
        .select({ count: sql<number>`count(*)` })
        .from(userCollectionsTable)
        .where(eq(userCollectionsTable.videoId, videoId));

      const activeLinksCount = remainingConnections?.count || 0;

      // Шаг 3: Если счетчик ссылок обнулился — стираем метаданные видео насовсем!
      if (activeLinksCount === 0) {
        await tx.delete(videosTable).where(eq(videosTable.videoId, videoId));

        console.log(
          `[🚀 ORPHAN CLEANUP] Видео ${videoId} больше никем не используется. Метаданные полностью стерты из videosTable.`,
        );
      } else {
        console.log(
          `[💾 SAFE DELETE] Связь пользователя ${userId} разорвана. Видео ${videoId} сохранено, так как оно есть у других пользователей (осталось связей: ${activeLinksCount}).`,
        );
      }
    });
  },

  /**
   * ⚡ 6. Последние добавленные на сайт видеоролики для витрины Главной страницы
   */
  getLatestVideos: async (
    limit: number = 8,
  ): Promise<{ videos: IVideoItem[] }> => {
    const rows = await db
      .select({
        videoId: videosTable.videoId,
        title: videosTable.title,
        authorName: videosTable.authorName,
        authorUrl: videosTable.authorUrl,
        category: sql<string>`'all'`,
      })
      .from(videosTable)
      .orderBy(desc(videosTable.createdAt))
      .limit(limit);

    return { videos: rows as IVideoItem[] };
  },

  /**
   * 🔍 7. ЖИВОЙ И БОЛЬШОЙ ПОИСК: Ищет совпадения по глобальной таблице видео (с пагинацией)
   * 🌟 ИСПРАВЛЕНО: Добавлен параметр page и полноценный расчет offset для листания страниц [0.2]
   */
  searchVideos: async (
    page: number = 1, // 🌟 Новое: текущая страница
    query: string,

    limit: number = 12, // Стандартизировали лимит под сетку карточек
  ): Promise<PaginatedVideos> => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return { videos: [], total: 0 };

    // Высчитываем, сколько видеороликов нужно пропустить для текущей страницы [0.2]
    const offset = (page - 1) * limit;
    const filter = like(videosTable.titleSearch, `%${cleanQuery}%`);
    const [rows, countResult] = await Promise.all([
      db
        .select({
          videoId: videosTable.videoId,
          title: videosTable.title,
          authorName: videosTable.authorName,
          authorUrl: videosTable.authorUrl,
          category: sql<string>`'all'`, // Для результатов глобального поиска отдаем дефолтную категорию
        })
        .from(videosTable)
        .where(filter)
        .orderBy(desc(videosTable.createdAt))
        .limit(limit) // 🌟 Ограничиваем количество роликов на страницу [0.2]
        .offset(offset), // 🌟 Сдвигаем курсор на нужный offset [0.2]

      // Считаем общее количество найденных совпадений по всему хабу
      db
        .select({ count: sql<number>`count(*)` })
        .from(videosTable)
        .where(filter),
    ]);

    return {
      videos: rows as IVideoItem[],
      total: countResult[0]?.count || 0,
    };
  },

  /**
   * 🏷️ 8. КАТЕГОРИИ: Сбор активных тегов (из всех коллекций пользователей)
   */
  getActiveCategories: async (): Promise<string[]> => {
    const rows = await db
      .select({ category: userCollectionsTable.category })
      .from(userCollectionsTable);

    // Собираем уникальные значения через Set
    const categories = Array.from(new Set(rows.map((r) => r.category)));
    return categories;
  },

  getActiveCategoriesByUserId: async (userId: number): Promise<string[]> => {
    const rows = await db
      .select({ category: userCollectionsTable.category })
      .from(userCollectionsTable)
      .where(eq(userCollectionsTable.userId, userId));

    const categories = Array.from(new Set(rows.map((r) => r.category)));
    return categories;
  },
};
