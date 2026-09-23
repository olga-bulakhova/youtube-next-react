import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '../../_utils';
import { videosDb } from '../_storage/videosStorage'; // Скоро заменим на prisma!
import { ApiSuccessResponse, ApiErrorResponse } from '../_storage/types';
import { SEARCH } from '@/shared/constants';

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
    const query = searchParams.get(SEARCH.QUERY_PARAM) || '';
    const page = Number(searchParams.get('page')) || 1;
    const trimmedQuery = query.trim();
    const result = await videosDb.searchVideos(page, trimmedQuery, 11);

    return apiSuccess(result);
  } catch (error) {
    console.error('[API_SEARCH_ERROR]', error);
    return apiError(SEARCH_MESSAGES.ERRORS.SERVER_ERROR, 500);
  }
}
