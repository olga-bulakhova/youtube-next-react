// import { NextResponse } from 'next/server';
// import { apiError, apiSuccess, db } from '../_utils';
// import { ApiErrorResponse, ApiSuccessResponse, IVideoItem, PostRequestBody } from './_storage/types';

// export const dynamic = 'force-dynamic';

// export async function GET(): Promise<NextResponse<ApiSuccessResponse>> {
//   return apiSuccess({ videos: db.getAllVideos() });
// }

// export async function POST(
//   request: Request,
// ): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
//   try {
//     const body = (await request.json()) as PostRequestBody;

//     if (!body || !body.videoId || typeof body.videoId !== 'string') {
//       return apiError('Идентификатор видео (videoId) обязателен');
//     }

//     if (!body.category || typeof body.category !== 'string') {
//       return apiError('Категория видео (category) обязательна');
//     }

//     const { videoId, category, userId } = body;

//     if (db.hasVideo(videoId)) {
//       return apiError('Это видео уже добавлено');
//     }

//     const rawResult = await fetch(
//       `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
//     );

//     if (!rawResult.ok) {
//       return apiError('Не удалось получить информацию о видео с YouTube');
//     }

//     const videoInfo = await rawResult.json();

//     if (!videoInfo || !videoInfo.title) {
//       return apiError('Видео не найдено на YouTube');
//     }

//     const newVideo: IVideoItem = {
//       videoId,
//       title: videoInfo.title,
//       authorName: videoInfo.author_name || 'Неизвестный автор',
//       authorUrl: videoInfo.author_url || '',
//       category: category.toLowerCase().trim(),
//       userId
//     };

//     db.addVideo(videoId, newVideo);

//     return apiSuccess({ videos: db.getAllVideos() }, 201);
//   } catch (error) {
//     return apiError('Невалидный JSON в теле запроса или ошибка сервера');
//   }
// }

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 1. Импортируем утилиту для работы с куками на сервере [0.3, 0.4]
import { apiError, apiSuccess } from '../_utils';
import { parseJsonCookie } from '@/shared/utils/cookies'; // Импортируем наш общий хелпер парсинга
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  IVideoItem,
  PostRequestBody,
} from './_storage/types';
import { db } from './_storage/videosStorage';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<ApiSuccessResponse>> {
  return apiSuccess({ videos: db.getAllVideos() });
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as PostRequestBody;

    // Валидация входных данных
    if (!body || !body.videoId || typeof body.videoId !== 'string') {
      return apiError('Идентификатор видео (videoId) обязателен');
    }

    if (!body.category || typeof body.category !== 'string') {
      return apiError('Категория видео (category) обязательна');
    }

    const { videoId, category } = body;

    // ==========================================
    // 🔐 БЕЗОПАСНОСТЬ: ИЗВЛЕКАЕМ USERID ИЗ COOKIES
    // ==========================================
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');

    // Используем наш типизированный хелпер для парсинга объекта пользователя
    const user = parseJsonCookie<{ id: number }>(userCookie?.value);

    // Если куки нет или она повреждена — блокируем запрос статусом 401 Unauthorized
    if (!user || !user.id) {
      return apiError(
        'Действие запрещено. Пожалуйста, авторизуйтесь в системе.',
        401,
      );
    }

    const currentUserId = user.id; // Получаем гарантированный числовой ID авторизованного юзера

    // Проверка на дубликат видео
    if (db.hasVideo(videoId)) {
      return apiError('Это видео уже добавлено');
    }

    // Запрос метаданных к YouTube API
    const rawResult = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );

    if (!rawResult.ok) {
      return apiError('Не удалось получить информацию о видео с YouTube');
    }

    const videoInfo = await rawResult.json();

    if (!videoInfo || !videoInfo.title) {
      return apiError('Видео не найдено на YouTube');
    }

    // Формируем модель данных
    const newVideo: IVideoItem = {
      videoId,
      title: videoInfo.title,
      authorName: videoInfo.author_name || 'Неизвестный автор',
      authorUrl: videoInfo.author_url || '',
      category: category.toLowerCase().trim(),
      userId: currentUserId, // ✅ БЕЗОПАСНО: Записываем серверный ID
    };

    db.addVideo(videoId, newVideo);

    return apiSuccess({ videos: db.getAllVideos() }, 201);
  } catch (error) {
    return apiError('Невалидный JSON в теле запроса или ошибка сервера');
  }
}
