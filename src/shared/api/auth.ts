import {
  AuthRequestBody,
  AuthSuccessResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/app/api/auth/_storage/types';
import { apiFetch } from './baseClient';
import { API_ROUTES } from '../constants';

export const authApi = {
  login: async (payload: AuthRequestBody): Promise<AuthSuccessResponse> => {
    return apiFetch<AuthSuccessResponse>(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: AuthRequestBody): Promise<AuthSuccessResponse> => {
    return apiFetch<AuthSuccessResponse>(API_ROUTES.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<{ success: boolean; debugLink?: string }> => {
    return apiFetch<{ success: boolean; debugLink?: string }>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify({ email: payload.email }),
      },
    );
  },

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(API_ROUTES.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: async (): Promise<{ ok: true; message?: string }> => {
    return apiFetch<{ ok: true; message?: string }>(API_ROUTES.AUTH.LOGOUT, {
      method: 'POST',
    });
  },
};
