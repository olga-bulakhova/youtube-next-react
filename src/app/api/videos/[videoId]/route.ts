import { NextResponse } from 'next/server';
import { apiError, apiSuccess } from '../../_utils'; // Укажите правильный относительный путь до ваших утилит
import { videosDb } from '../_storage/videosStorage';
import { serverCookies } from '@/shared/utils-server';

type DeleteRouteProps = {
  params: Promise<{ videoId: string }>;
};

const DELETE_VIDEO_ERROR_MESSAGES = {
  AUTH: {
    UNAUTHORIZED: 'Вы должны быть авторизованы для удаления видео',
  },
  SERVER: {
    CRITICAL_ERROR: 'Не удалось удалить видео. Ошибка сервера',
  },
} as const;

export async function DELETE(
  request: Request,
  { params }: DeleteRouteProps,
): Promise<NextResponse> {
  try {
    const { videoId } = await params;

    const user = await serverCookies.getUser();
    if (!user || !user.id) {
      return apiError(DELETE_VIDEO_ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    await videosDb.deleteVideo(videoId, user.id);

    const updatedVideos = await videosDb.getVideosByUserId(user.id);

    return apiSuccess({ videos: updatedVideos });
  } catch (error) {
    console.error('[VIDEO_DELETE_ERROR]', error);
    return apiError(DELETE_VIDEO_ERROR_MESSAGES.SERVER.CRITICAL_ERROR, 500);
  }
}
