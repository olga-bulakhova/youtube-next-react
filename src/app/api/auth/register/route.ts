import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '../../_utils';
import {
  ApiErrorResponse,
  AuthRequestBody,
  AuthSuccessResponse,
  IUser,
} from '../_storage/types';
import { usersDb } from '../_storage/usersStorage';
import { serverCookies } from '@/shared/utils-server/cookies';
import { generateToken } from '@/shared/utils-server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody;

    // Валидация структуры запроса
    if (!body || !body.username || typeof body.username !== 'string') {
      return apiError(
        'Имя пользователя (username) обязательно для заполнения',
        400,
      );
    }

    if (!body.password || typeof body.password !== 'string') {
      return apiError('Пароль (password) обязателен для заполнения', 400);
    }

    const usernameClean = body.username.trim();
    const passwordClean = body.password.trim();

    if (usernameClean.length < 3) {
      return apiError(
        'Имя пользователя должно содержать минимум 3 символа',
        400,
      );
    }

    if (passwordClean.length < 6) {
      return apiError('Пароль должен содержать минимум 6 символов', 400);
    }

    // Проверка уникальности логина
    if (usersDb.isUsernameTaken(usernameClean)) {
      return apiError('Пользователь с таким именем уже зарегистрирован', 400);
    }

    // Генерация автоинкрементного ID
    const newUserId = usersDb.getNextId();

    const newUser: IUser = {
      id: newUserId,
      username: usernameClean,
      createdAt: new Date().toISOString(),
    };

    // Запись профиля и хэширование пароля в памяти сервера
    usersDb.addUser(newUser, passwordClean);

    // Генерация токена сессии
    const fullTokenString = generateToken({
      userId: newUser.id,
      username: newUser.username,
    });

    console.log(
      `[AUTH] Новая регистрация и автологин. ID: ${newUserId}, Login: ${usernameClean}`,
    );

    // Подготавливаем чистый объект профиля для записи и ответа
    const userData = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };

    // Хелпер сам применит HttpOnly для токена и Lax политики для безопасности 🛡️
    await serverCookies.setToken(fullTokenString);

    // Возвращаем структуру AuthSuccessResponse
    return apiSuccess(
      {
        user: userData,
        token: fullTokenString,
      },
      201,
    );
  } catch (error) {
    return apiError(
      'Невалидный JSON в теле запроса или критическая ошибка сервера',
      400,
    );
  }
}
