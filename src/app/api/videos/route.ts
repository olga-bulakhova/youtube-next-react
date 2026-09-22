import { NextResponse } from 'next/server';
import { apiError, apiSuccess } from '../_utils';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  PostRequestBody,
} from './_storage/types';

import { videosDb } from './_storage/videosStorage';
import { checkYoutubeVideo, serverCookies } from '@/shared/utils-server';

export const dynamic = 'force-dynamic';

/**
 * 🗺️ СЛОВАРЬ ОШИБОК И СИСТЕМНЫХ УВЕДОМЛЕНИЙ БЭКЕНДА ВИДЕО
 */
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
    ALREADY_EXISTS: 'Это видео уже добавлено',
  },
  YOUTUBE_API: {
    NOT_FOUND:
      'Видео не найдено на серверах YouTube. Возможно, оно удалено или является приватным.',
    EMBED_DISABLED:
      'Автор этого ролика запретил его воспроизведение на сторонних сайтах.',
    AGE_RESTRICTED:
      'Это видео содержит возрастные ограничения (18+). Доступно только на YouTube.',
    OEMBED_FAILED: 'Не удалось получить метаданные видео с YouTube.',
    NOT_FOUND_OEMBED: 'Видео не найдено на YouTube',
    UNKNOWN_CHECK_ERROR: 'Не удалось проверить видео через YouTube API.',
  },
} as const;

export async function GET(): Promise<NextResponse<ApiSuccessResponse>> {
  // ИЗМЕНЕНИЕ 1: Добавлен await для получения всех видео из базы
  const allVideos = await videosDb.getAllVideos();
  return apiSuccess({ videos: allVideos });
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as PostRequestBody;

    // 1. Валидация входных параметров
    if (!body || !body.videoId || typeof body.videoId !== 'string') {
      return apiError(VIDEO_ERROR_MESSAGES.VALIDATION.VIDEO_ID_REQUIRED);
    }

    if (!body.category || typeof body.category !== 'string') {
      return apiError(VIDEO_ERROR_MESSAGES.VALIDATION.CATEGORY_REQUIRED);
    }

    const { videoId, category } = body;

    // 2. Проверка сессии пользователя
    const user = await serverCookies.getUser();

    if (!user || !user.id) {
      return apiError(VIDEO_ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    const currentUserId = user.id;

    // ИЗМЕНЕНИЕ 2: Добавлен await для проверки дубликата в реальной базе данных
    const isVideoExist = await videosDb.hasVideo(videoId);
    if (isVideoExist) {
      return apiError(VIDEO_ERROR_MESSAGES.DB.ALREADY_EXISTS);
    }

    // 4. Проверка ограничений через официальную шину Google API
    const checkResult = await checkYoutubeVideo(videoId);

    if (!checkResult.allowed) {
      if (checkResult.reason === 'NOT_FOUND') {
        return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.NOT_FOUND, 400);
      }
      if (checkResult.reason === 'EMBED_DISABLED') {
        return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.EMBED_DISABLED, 400);
      }
      if (checkResult.reason === 'AGE_RESTRICTED') {
        return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.AGE_RESTRICTED, 400);
      }
      return apiError(
        VIDEO_ERROR_MESSAGES.YOUTUBE_API.UNKNOWN_CHECK_ERROR,
        400,
      );
    }

    // 5. Запрос официальных метаданных для формирования карточки плеера
    const rawResult = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );

    if (!rawResult.ok) {
      return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.OEMBED_FAILED, 400);
    }

    const videoInfo = await rawResult.json();

    if (!videoInfo || !videoInfo.title) {
      return apiError(VIDEO_ERROR_MESSAGES.YOUTUBE_API.NOT_FOUND_OEMBED);
    }

    // Формируем модель данных без videoId внутри объекта, так как мы передаем его аргументом
    const videoData = {
      title: videoInfo.title,
      authorName: videoInfo.author_name || 'Неизвестный автор',
      authorUrl: videoInfo.author_url || '',
      category: category.toLowerCase().trim(),
      userId: currentUserId,
    };

    // ИЗМЕНЕНИЕ 3: Добавлен await при сохранении новой записи в SQLite
    await videosDb.addVideo(videoId, videoData);

    // ИЗМЕНЕНИЕ 4: Добавлен await для возвращения обновленного списка видео
    const updatedVideos = await videosDb.getAllVideos();
    return apiSuccess({ videos: updatedVideos }, 201);
  } catch (error) {
    console.error('[VIDEOS_POST_ERROR]', error); // Логируем ошибку в консоль для отладки
    return apiError(
      VIDEO_ERROR_MESSAGES.VALIDATION.INVALID_BODY_OR_SERVER,
      500,
    );
  }
}
