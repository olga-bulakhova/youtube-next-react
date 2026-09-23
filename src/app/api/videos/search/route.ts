import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '../../_utils';
import { videosDb } from '../_storage/videosStorage'; // Скоро заменим на prisma!
import { ApiSuccessResponse, ApiErrorResponse } from '../_storage/types';

export const dynamic = 'force-dynamic';

const SEARCH_MESSAGES = {
  ERRORS: {
    SERVER_ERROR: 'Ошибка сервера при выполнении поиска.',
  },
} as const;

export async function GET(
  request: Request,
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const trimmedQuery = query.trim();

    if (trimmedQuery.length <= 0) {
      return apiSuccess({ videos: [], total: 0 });
    }

    const result = await videosDb.searchVideos(trimmedQuery, 11);

    return apiSuccess(result);
  } catch (error) {
    console.error('[API_SEARCH_ERROR]', error);
    return apiError(SEARCH_MESSAGES.ERRORS.SERVER_ERROR, 500);
  }
}
