export interface IUser {
  id: number;
  username: string;
  createdAt: string;
}

export interface IUserCookie {
  id: number;
  username: string;
}

/**
 * Тело запроса для авторизации (POST /api/auth/login)
 */
export interface AuthRequestBody {
  password: string;
  username?: string; // 🌟 ИСПРАВЛЕНО: Убрано поле username из AuthRequestBody [0.2]
  email: string; // 🌟 ИСПРАВЛЕНО: Добавлен параметр email для проверки на занятость адреса электронной почты [0.2]
}

export interface AuthSuccessResponse {
  ok: true;
  user: IUser;
  token: string; // Используется для сохранения в Cookies или LocalStorage
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
