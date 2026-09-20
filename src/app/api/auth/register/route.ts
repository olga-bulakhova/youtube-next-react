import { NextResponse } from 'next/server';
import { usersDb } from '../_storage/usersStorage';
import { ApiErrorResponse, AuthRequestBody, AuthSuccessResponse, IUser } from '../_storage/types';
import { apiError, apiSuccess } from '../../_utils';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
): Promise<NextResponse<AuthSuccessResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as AuthRequestBody;

    // 1. ВАЛИДАЦИЯ СЕРВЕРА: Проверяем наличие и типы полей в прилетевшем JSON
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

    // Защита от слишком коротких данных в обход клиентской формы
    if (usernameClean.length < 3) {
      return apiError(
        'Имя пользователя должно содержать минимум 3 символа',
        400,
      );
    }

    if (passwordClean.length < 6) {
      return apiError('Пароль должен содержать минимум 6 символов', 400);
    }

    // 2. ПРОВЕРКА НА УНИКАЛЬНОСТЬ: Проверяем, занят ли логин в нашей usersDb
    if (usersDb.isUsernameTaken(usernameClean)) {
      return apiError('Пользователь с таким именем уже зарегистрирован', 400);
    }

    // 3. АВТОИНКРЕМЕНТ ID: Генерируем следующий доступный числовой ID (например, 2, 3...)
    const newUserId = usersDb.getNextId();

    // Формируем чистый публичный объект профиля без пароля
    const newUser: IUser = {
      id: newUserId,
      username: usernameClean,
      createdAt: new Date().toISOString(),
    };

    // 4. ЗАПИСЬ В STORAGE: Сохраняем профиль и скрытый пароль в изолированные карты памяти
    usersDb.addUser(newUser, passwordClean);

    // Имитируем генерацию токена безопасности сессии (базовый base64 хэш для учебных целей)
    const mockJwtToken = btoa(
      JSON.stringify({ userId: newUserId, role: 'user' }),
    );

    console.log(
      `[AUTH] Успешная регистрация нового аккаунта. ID: ${newUserId}, Login: ${usernameClean}`,
    );

    // 5. ОТВЕТ УСПЕХА (201 Created): Возвращаем структуру AuthSuccessResponse
    return apiSuccess(
      {
        user: newUser,
        token: `mock_jwt_${mockJwtToken}`,
      },
      201,
    );
  } catch (_) {
    return apiError(
      'Невалидный JSON в теле запроса или критическая ошибка сервера',
      400,
    );
  }
}
