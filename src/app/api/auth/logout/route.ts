import { NextResponse } from 'next/server';
import { serverCookies } from '@/shared/server/cookies'; // Путь к вашему серверному файлу кук
import { apiSuccess, apiError } from '../../_utils';

export const dynamic = 'force-dynamic';

export async function POST(): Promise<NextResponse> {
  try {
    await serverCookies.clearAuth();
    return apiSuccess({ message: 'Сессия успешно завершена' }, 200);
  } catch (error) {
    return apiError('Не удалось выйти из системы', 500);
  }
}
