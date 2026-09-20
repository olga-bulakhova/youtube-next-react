import { NextResponse } from 'next/server';
import { apiError, apiSuccess } from '../_utils';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  IVideoItem,
  PostRequestBody,
  db,
} from '../_utils';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<ApiSuccessResponse>> {
  return apiSuccess({ videos: db.getAllVideos() });
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as PostRequestBody;

    if (!body || !body.videoId || typeof body.videoId !== 'string') {
      return apiError('Идентификатор видео (videoId) обязателен');
    }

    if (!body.category || typeof body.category !== 'string') {
      return apiError('Категория видео (category) обязательна');
    }

    const { videoId, category, userId } = body;

    if (db.hasVideo(videoId)) {
      return apiError('Это видео уже добавлено');
    }

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

    const newVideo: IVideoItem = {
      videoId,
      title: videoInfo.title,
      authorName: videoInfo.author_name || 'Неизвестный автор',
      authorUrl: videoInfo.author_url || '',
      category: category.toLowerCase().trim(),
      userId
    };

    db.addVideo(videoId, newVideo);

    return apiSuccess({ videos: db.getAllVideos() }, 201);
  } catch (error) {
    return apiError('Невалидный JSON в теле запроса или ошибка сервера');
  }
}

