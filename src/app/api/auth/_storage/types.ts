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
  username: string;
  password: string;
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
