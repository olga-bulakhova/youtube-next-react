import { NextResponse } from 'next/server';
import { usersDb } from '../_storage/usersStorage';
import { apiSuccess, apiError } from '../../_utils';

export const dynamic = 'force-dynamic';

const RESET_PASSWORD_MESSAGES = {
  VALIDATION: {
    DATA_REQUIRED: 'Токен и новый пароль обязательны для заполнения',
    PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 6 символов',
    TOKEN_EXPIRED:
      'Ссылка восстановления устарела, недействительна или уже была использована',
    SERVER_ERROR: 'Внутренняя ошибка сервера при обновлении пароля',
  },
} as const;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (
      !body ||
      !body.token ||
      !body.newPassword ||
      typeof body.token !== 'string' ||
      typeof body.newPassword !== 'string'
    ) {
      return apiError(RESET_PASSWORD_MESSAGES.VALIDATION.DATA_REQUIRED, 400);
    }

    const tokenClean = body.token.trim();
    const passwordClean = body.newPassword.trim();

    if (passwordClean.length < 6) {
      return apiError(
        RESET_PASSWORD_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT,
        400,
      );
    }

    const currentTime = Date.now();

    const dbToken = await usersDb.validateResetToken(tokenClean, currentTime);

    if (!dbToken) {
      return apiError(RESET_PASSWORD_MESSAGES.VALIDATION.TOKEN_EXPIRED, 400);
    }

    await usersDb.resetUserPassword(dbToken.userId, dbToken.id, passwordClean);

    console.log(
      `[AUTH RESET] Пароль успешно изменен через слой репозитория для ID: ${dbToken.userId}`,
    );

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[RESET_PASSWORD_ROUTE_ERROR]', error);
    return apiError(RESET_PASSWORD_MESSAGES.VALIDATION.SERVER_ERROR, 500);
  }
}
