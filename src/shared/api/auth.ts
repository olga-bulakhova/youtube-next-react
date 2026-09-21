import {
  AuthRequestBody,
  AuthSuccessResponse,
} from '@/app/api/auth/_storage/types';
import { apiFetch } from './baseClient';
import { API_ROUTES } from '../constants';

export const authApi = {
  /**
   * Вход в систему (POST)
   */
  login: async (payload: AuthRequestBody): Promise<AuthSuccessResponse> => {
    return apiFetch<AuthSuccessResponse>(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Регистрация нового аккаунта (POST)
   */
  register: async (payload: AuthRequestBody): Promise<AuthSuccessResponse> => {
    return apiFetch<AuthSuccessResponse>(API_ROUTES.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Выход из системы с очисткой кук (POST)
   */
  logout: async (): Promise<{ ok: true; message?: string }> => {
    return apiFetch<{ ok: true; message?: string }>(API_ROUTES.AUTH.LOGOUT, {
      method: 'POST',
    });
  },
};
