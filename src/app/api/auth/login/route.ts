import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '../../_utils';
import {
  ApiErrorResponse,
  AuthRequestBody,
  AuthSuccessResponse,
} from '../_storage/types';
import { usersDb } from '../_storage/usersStorage';
import { serverCookies } from '@/shared/utils-server';
import { generateToken } from '@/shared/utils-server/token';

export const dynamic = 'force-dynamic';

const LOGIN_ERROR_MESSAGES = {
  VALIDATION: {
    USERNAME_REQUIRED: 'Имя пользователя (username) обязательно для заполнения',
    PASSWORD_REQUIRED: 'Пароль (password) обязателен для заполнения',
    INVALID_JSON_OR_SERVER:
      'Невалидный JSON в теле запроса или внутренняя ошибка сервера',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Неверное имя пользователя или пароль',
  },
} as const;

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody;

    if (!body || !body.username || typeof body.username !== 'string') {
      return apiError(LOGIN_ERROR_MESSAGES.VALIDATION.USERNAME_REQUIRED, 400);
    }

    if (!body.password || typeof body.password !== 'string') {
      return apiError(LOGIN_ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED, 400);
    }

    const usernameClean = body.username.trim();
    const passwordClean = body.password.trim();

    const user = usersDb.getUserByUsername(usernameClean);

    if (!user) {
      return apiError(LOGIN_ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = usersDb.verifyPassword(user.id, passwordClean);

    if (!isPasswordValid) {
      return apiError(LOGIN_ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const fullTokenString = generateToken({
      userId: user.id,
      username: user.username,
    });

    console.log(
      `[AUTH] Успешный вход в систему. ID: ${user.id}, Login: ${user.username}`,
    );

    const userData = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };

    await serverCookies.setToken(fullTokenString);

    return apiSuccess(
      {
        user: userData,
        token: fullTokenString,
      },
      200,
    );
  } catch (error) {
    return apiError(
      LOGIN_ERROR_MESSAGES.VALIDATION.INVALID_JSON_OR_SERVER,
      400,
    );
  }
}
