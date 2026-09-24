import { NextResponse } from 'next/server';
import { apiError, apiSuccess } from '../_utils';
import { videosDb } from './_storage/videosStorage';
import { checkYoutubeVideo, serverCookies } from '@/shared/utils-server';
import { ITEMS_PER_PAGE } from '@/shared/constants';

export const dynamic = 'force-dynamic';

const VIDEO_ERROR_MESSAGES = {
  VALIDATION: {
    VIDEO_ID_REQUIRED: 'Идентификатор видео (videoId) обязателен',
    CATEGORY_REQUIRED: 'Категория видео (category) обязательна',
    INVALID_BODY_OR_SERVER: 'Невалидный JSON в теле запроса или ошибка сервера',
  },
  AUTH: {
    UNAUTHORIZED: 'Действие запрещено. Пожалуйста, авторизуйтесь в системе.',
  },
  DB: {
    ALREADY_IN_COLLECTION: 'Вы уже добавили это видео в свою коллекцию',
  },
  YOUTUBE_API: {
    NOT_FOUND: 'Видео не найдено на серверах YouTube.',
    EMBED_DISABLED:
      'Автор ролика запретил его воспроизведение на сторонних сайтах.',
    AGE_RESTRICTED: 'Это видео содержит возрастные ограничения (18+).',
    NOT_FOUND_OEMBED: 'Не удалось получить метаданные видео с YouTube.',
    UNKNOWN_CHECK_ERROR: 'Не удалось проверить видео через YouTube API.',
  },
} as const;

/**
 * 📥 GET: Получение видеороликов
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;

    // Считываем сессию, чтобы понять, чью коллекцию выводить
    const user = await serverCookies.getUser();

    // Если пользователь залогинен — отдаем ЕГО персональную коллекцию
    if (user && user.id) {
      const myVideosData = await videosDb.getMyVideos(
        user.id,
        page,
        ITEMS_PER_PAGE,
      );
      return apiSuccess(myVideosData);
    }

    // Если это гость — отдаем глобальную Видеотеку сайта
    const allVideosData = await videosDb.getAllVideos(page, ITEMS_PER_PAGE);
    return apiSuccess(allVideosData);
  } catch (error) {
    console.error('[VIDEOS_GET_ERROR]', error);
    return apiError(
      VIDEO_ERROR_MESSAGES.VALIDATION.INVALID_BODY_OR_SERVER,
      500,
    );
  }
}

/**
 * 📤 POST: Добавление видео к себе в коллекцию (или создание нового на сайте)
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body || !body.videoId || typeof body.videoId !== 'string') {
      return apiError(VIDEO_ERROR_MESSAGES.VALIDATION.VIDEO_ID_REQUIRED, 400);
    }
    if (!body.category || typeof body.category !== 'string') {
      return apiError(VIDEO_ERROR_MESSAGES.VALIDATION.CATEGORY_REQUIRED, 400);
    }

    const { videoId, category } = body;

    // Проверка сессии автора
    const user = await serverCookies.getUser();
    if (!user || !user.id) {
      return apiError(VIDEO_ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    // 🌟 ИСПРАВЛЕНО: Проверяем дубликат только внутри КОЛЛЕКЦИИ ТЕКУЩЕГО пользователя [1.0]
    const isAlreadyAdded = await videosDb.hasVideoInCollection(
      videoId,
      user.id,
    );
    if (isAlreadyAdded) {
      return apiError(VIDEO_ERROR_MESSAGES.DB.ALREADY_IN_COLLECTION, 400);
    }

    // Проверка ограничений через шину Google API
    const checkResult = await checkYoutubeVideo(videoId);
    if (!checkResult.allowed) {
      if (checkResult.reason === 'NOT_FOUND')
        return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.NOT_FOUND, 400);
      if (checkResult.reason === 'EMBED_DISABLED')
        return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.EMBED_DISABLED, 400);
      if (checkResult.reason === 'AGE_RESTRICTED')
        return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.AGE_RESTRICTED, 400);
      return apiError(
        VIDEO_ERROR_MESSAGES.YOUTUBE_API.UNKNOWN_CHECK_ERROR,
        400,
      );
    }

    const videoInfo = checkResult.info;
    if (!videoInfo || !videoInfo.title) {
      return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.NOT_FOUND_OEMBED, 400);
    }

    const videoData = {
      title: videoInfo.title,
      authorName: videoInfo.authorName || '',
      authorUrl: videoInfo.authorUrl || '',
      category: category.toLowerCase().trim(),
      userId: user.id,
    };

    // 🚀 Вызываем наш новый умный метод добавления (Many-to-Many линковка) [1.0]
    await videosDb.addVideo(videoId, videoData);

    // Возвращаем обновленную персональную коллекцию пользователя
    const updatedVideos = await videosDb.getMyVideos(
      user.id,
      1,
      ITEMS_PER_PAGE,
    );
    return apiSuccess(updatedVideos, 201);
  } catch (error) {
    console.error('[VIDEOS_POST_ERROR]', error);
    return apiError(
      VIDEO_ERROR_MESSAGES.VALIDATION.INVALID_BODY_OR_SERVER,
      500,
    );
  }
}
