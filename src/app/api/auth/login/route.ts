import { NextResponse } from 'next/server';
 // Импортируем нашу singleton-базу
import {

  apiSuccess,
  apiError,
} from '../../_utils';
import { ApiErrorResponse, AuthRequestBody, AuthSuccessResponse } from '../_storage/types';
import { usersDb } from '../_storage/usersStorage';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody;

    // 1. ВАЛИДАЦИЯ СТРУКТУРЫ ЗАПРОСА
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

    // 2. ПОИСК ПОЛЬЗОВАТЕЛЯ В БАЗЕ ДАННЫХ
    const user = usersDb.getUserByUsername(usernameClean);

    // БЕЗОПАСНОСТЬ: Если пользователь не найден, мы не пишем "Пользователь не найден".
    // Вместо этого отдаем общую ошибку, чтобы хакеры не могли перебирать существующие логины (User Enumeration).
    if (!user) {
      return apiError('Неверное имя пользователя или пароль', 401);
    }

    // 3. ПРОВЕРКА ЗАХЕШИРОВАННОГО ПАРОЛЯ
    // Метод verifyPassword сам внутри применит crypto.createHash('sha256') к введенной строке
    const isPasswordValid = usersDb.verifyPassword(user.id, passwordClean);

    if (!isPasswordValid) {
      return apiError('Неверное имя пользователя или пароль', 401);
    }

    // 4. ГЕНЕРАЦИЯ СЕССИОННОГО ТОКЕНА
    const mockJwtToken = btoa(
      JSON.stringify({ userId: user.id, role: 'user' }),
    );

    console.log(
      `[AUTH] Успешный вход в систему. ID: ${user.id}, Login: ${user.username}`,
    );

    // 5. ОТВЕТ УСПЕХА: Возвращаем данные профиля и токен
    return apiSuccess(
      {
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
        },
        token: `mock_jwt_${mockJwtToken}`,
      },
      200,
    );
  } catch (error) {
    return apiError(
      'Невалидный JSON в теле запроса или внутренняя ошибка сервера',
      400,
    );
  }
}
