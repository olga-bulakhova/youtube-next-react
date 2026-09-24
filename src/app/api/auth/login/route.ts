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
    EMAIL_REQUIRED: 'Электронная почта (email) обязательна для заполнения',
    PASSWORD_REQUIRED: 'Пароль (password) обязателен для заполнения',
    INVALID_JSON_OR_SERVER:
      'Невалидный JSON в теле запроса или внутренняя ошибка сервера',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Неверный Email или пароль',
  },
} as const;

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody;

    if (!body || !body.email || typeof body.email !== 'string') {
      return apiError(LOGIN_ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED, 400);
    }

    if (!body.password || typeof body.password !== 'string') {
      return apiError(LOGIN_ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED, 400);
    }

    const emailClean = body.email.trim();
    const passwordClean = body.password.trim();

    const user = await usersDb.getUserByEmail(emailClean);

    if (!user) {
      return apiError(LOGIN_ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = await usersDb.verifyPassword(
      user.id,
      passwordClean,
    );

    if (!isPasswordValid) {
      return apiError(LOGIN_ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const fullTokenString = generateToken({
      userId: user.id,
      username: user.username,
    });

    console.log(
      `[AUTH] Успешный вход в систему. ID: ${user.id}, Email: ${emailClean}, Display Name: ${user.username}`,
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
    console.error('[LOGIN_CRITICAL_ERROR]', error);
    return apiError(
      LOGIN_ERROR_MESSAGES.VALIDATION.INVALID_JSON_OR_SERVER,
      500,
    );
  }
}
