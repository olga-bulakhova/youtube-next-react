import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '../../_utils';
import {
  ApiErrorResponse,
  AuthRequestBody,
  AuthSuccessResponse,
} from '../_storage/types';
import { usersDb } from '../_storage/usersStorage';
import { serverCookies } from '@/shared/server';
import { generateToken } from '@/shared/server/token';

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

    if (!user) {
      return apiError('Неверное имя пользователя или пароль', 401);
    }

    // 3. ПРОВЕРКА ЗАХЕШИРОВАННОГО ПАРОЛЯ
    const isPasswordValid = usersDb.verifyPassword(user.id, passwordClean);

    if (!isPasswordValid) {
      return apiError('Неверное имя пользователя или пароль', 401);
    }

    // 4. ИСПРАВЛЕНО: ГЕНЕРАЦИЯ СЕССИОННОГО ТОКЕНА ЧЕРЕЗ ФУНКЦИЮ
    // Передаем только нужный payload, утилита сама упакует его в Base64 с префиксом 🛡️
    const fullTokenString = generateToken({
      userId: user.id,
      username: user.username,
    });

    console.log(
      `[AUTH] Успешный вход в систему. ID: ${user.id}, Login: ${user.username}`,
    );

    // Подготавливаем чистый объект профиля
    const userData = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };

    // ==========================================
    // 💾 БЕЗОПАСНАЯ ЗАПИСЬ ЧЕРЕЗ ХЕЛПЕР
    // ==========================================
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
      'Невалидный JSON в теле запроса или внутренняя ошибка сервера',
      400,
    );
  }
}
