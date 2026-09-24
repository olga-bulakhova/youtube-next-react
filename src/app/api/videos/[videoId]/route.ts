import { NextResponse } from 'next/server';
import { apiError, apiSuccess } from '../../_utils';
import { videosDb } from '../_storage/videosStorage';
import { serverCookies } from '@/shared/utils-server';
import { ITEMS_PER_PAGE } from '@/shared/constants';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> },
): Promise<NextResponse> {
  try {
    const { videoId } = await params;

    if (!videoId) {
      return apiError(
        'Идентификатор видео (videoId) обязателен для удаления',
        400,
      );
    }

    // Проверяем сессию пользователя, который инициировал удаление
    const user = await serverCookies.getUser();
    if (!user || !user.id) {
      return apiError('Действие запрещено. Пожалуйста, авторизуйтесь.', 401);
    }

    // 🌟 ИСПРАВЛЕНО: Стираем только связь из user_collections текущего пользователя! [0.3]
    await videosDb.deleteVideoFromCollection(videoId, user.id);

    console.log(
      `[API DELETE] Связь с видео ${videoId} успешно удалена у пользователя ID: ${user.id}`,
    );

    // Возвращаем обновленный список личной коллекции автора
    const updatedVideos = await videosDb.getMyVideos(
      user.id,
      1,
      ITEMS_PER_PAGE,
    );
    return apiSuccess(updatedVideos);
  } catch (error) {
    console.error('[VIDEOS_DELETE_ERROR]', error);
    return apiError('Внутренняя ошибка сервера при удалении видеоролика', 500);
  }
}
