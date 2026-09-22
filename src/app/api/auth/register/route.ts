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

/**
 * 🗺️ СЛОВАРЬ ОШИБОК И СИСТЕМНЫХ УВЕДОМЛЕНИЙ ДЛЯ РЕГИСТРАЦИИ
 */
const REGISTER_ERROR_MESSAGES = {
  VALIDATION: {
    USERNAME_REQUIRED: 'Имя пользователя (username) обязательно для заполнения',
    PASSWORD_REQUIRED: 'Пароль (password) обязателен для заполнения',
    USERNAME_TOO_SHORT: 'Имя пользователя должно содержать минимум 3 символа',
    PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 6 символов',
    INVALID_JSON_OR_SERVER:
      'Невалидный JSON в теле запроса или критическая ошибка сервера',
  },
  BUSINESS_LOGIC: {
    USERNAME_TAKEN: 'Пользователь с таким именем уже зарегистрирован',
  },
} as const;

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody;

    if (!body || !body.username || typeof body.username !== 'string') {
      return apiError(
        REGISTER_ERROR_MESSAGES.VALIDATION.USERNAME_REQUIRED,
        400,
      );
    }

    if (!body.password || typeof body.password !== 'string') {
      return apiError(
        REGISTER_ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED,
        400,
      );
    }

    const usernameClean = body.username.trim();
    const passwordClean = body.password.trim();

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

    // ВАЖНО: Добавлен await, так как проверка теперь идет в файле БД
    const isTaken = await usersDb.isUsernameTaken(usernameClean);
    if (isTaken) {
      return apiError(
        REGISTER_ERROR_MESSAGES.BUSINESS_LOGIC.USERNAME_TAKEN,
        400,
      );
    }

    // Передаем данные в БД и получаем созданного пользователя с автоинкрементным ID.
    const newUser = await usersDb.addUser(usernameClean, passwordClean);

    const fullTokenString = generateToken({
      userId: newUser.id,
      username: newUser.username,
    });

    console.log(
      `[AUTH] Новая регистрация и автологин. ID: ${newUser.id}, Login: ${usernameClean}`,
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
