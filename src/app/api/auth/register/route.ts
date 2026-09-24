import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '../../_utils';
import {
  ApiErrorResponse,
  AuthRequestBody,
  AuthSuccessResponse,
} from '../_storage/types';
import { usersDb } from '../_storage/usersStorage';
import { serverCookies } from '@/shared/utils-server/cookies';
import { generateToken } from '@/shared/utils-server';

export const dynamic = 'force-dynamic';

const REGISTER_ERROR_MESSAGES = {
  VALIDATION: {
    USERNAME_REQUIRED: 'Имя пользователя (username) обязательно для заполнения',
    EMAIL_REQUIRED: 'Email обязателен для заполнения',
    EMAIL_INVALID: 'Введите корректный email',
    PASSWORD_REQUIRED: 'Пароль (password) обязателен для заполнения',
    USERNAME_TOO_SHORT: 'Имя пользователя должно содержать минимум 3 символа',
    PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 6 символов',
    INVALID_JSON_OR_SERVER:
      'Невалидный JSON в теле запроса или критическая ошибка сервера',
  },
  BUSINESS_LOGIC: {
    EMAIL_TAKEN: 'Пользователь с таким email уже зарегистрирован',
  },
} as const;

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody & { email?: string };

    // 1. Валидация структуры и наличия полей
    if (!body || !body.username || typeof body.username !== 'string') {
      return apiError(
        REGISTER_ERROR_MESSAGES.VALIDATION.USERNAME_REQUIRED,
        400,
      );
    }

    if (!body.email || typeof body.email !== 'string') {
      return apiError(REGISTER_ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED, 400);
    }

    if (!body.password || typeof body.password !== 'string') {
      return apiError(
        REGISTER_ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED,
        400,
      );
    }

    const usernameClean = body.username.trim();
    const emailClean = body.email.trim().toLowerCase();
    const passwordClean = body.password.trim();

    // 2. Проверка длины и формата данных
    if (usernameClean.length < 3) {
      return apiError(
        REGISTER_ERROR_MESSAGES.VALIDATION.USERNAME_TOO_SHORT,
        400,
      );
    }

    if (passwordClean.length < 6) {
      return apiError(
        REGISTER_ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT,
        400,
      );
    }

    // 4. Проверка уникальности Email в базе данных
    const isEmailTaken = await usersDb.isEmailTaken(emailClean);
    if (isEmailTaken) {
      return apiError(REGISTER_ERROR_MESSAGES.BUSINESS_LOGIC.EMAIL_TAKEN, 400);
    }

    // 5. Передаем данные в БД (передаем username, email и пароль)
    const newUser = await usersDb.addUser(
      usernameClean,
      emailClean,
      passwordClean,
    );

    const fullTokenString = await generateToken({
      userId: newUser.id,
      username: newUser.username,
    });

    console.log(`[fullTokenString] ${fullTokenString}`);

    console.log(
      `[AUTH] Новая регистрация и автологин. ID: ${newUser.id}, Login: ${usernameClean}, Email: ${emailClean}`,
    );

    const userData = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };

    await serverCookies.setToken(fullTokenString);

    return apiSuccess(
      {
        user: userData,
        token: fullTokenString,
      },
      201,
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return apiError(
      REGISTER_ERROR_MESSAGES.VALIDATION.INVALID_JSON_OR_SERVER,
      400,
    );
  }
}
