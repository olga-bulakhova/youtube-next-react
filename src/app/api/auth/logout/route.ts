import { NextResponse } from 'next/server';
import { serverCookies } from '@/shared/utils-server/cookies';
import { apiSuccess, apiError } from '../../_utils';

export const dynamic = 'force-dynamic';

const LOGOUT_MESSAGES = {
  SUCCESS: 'Сессия успешно завершена',
  ERROR: 'Не удалось выйти из системы',
} as const;

export async function POST(): Promise<NextResponse> {
  try {
    await serverCookies.clearAuth();

    return apiSuccess({ message: LOGOUT_MESSAGES.SUCCESS }, 200);
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error);
    return apiError(LOGOUT_MESSAGES.ERROR, 500);
  }
}
