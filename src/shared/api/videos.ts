import { ApiSuccessResponse } from '@/app/api/videos/_storage/types';
import { apiFetch } from './baseClient'; // Импортируем нашу общую утилиту
import { API_ROUTES, SEARCH } from '../constants';

interface AddVideoPayload {
  videoId: string;
  category: string;
}

export const videosApi = {
  getAll: async (): Promise<ApiSuccessResponse> => {
    return apiFetch<ApiSuccessResponse>(API_ROUTES.VIDEOS.BASE, {
      method: 'GET',
      next: { revalidate: 0 }, // Отключаем кэш в Next.js 16
    });
  },

  add: async (payload: AddVideoPayload): Promise<ApiSuccessResponse> => {
    return apiFetch<ApiSuccessResponse>(API_ROUTES.VIDEOS.BASE, {
      method: 'POST',
      body: JSON.stringify(payload), // Заголовки Content-Type подставятся автоматически! 🛡️
    });
  },

  delete: async (videoId: string): Promise<ApiSuccessResponse> => {
    return apiFetch<ApiSuccessResponse>(API_ROUTES.VIDEOS.BY_ID(videoId), {
      method: 'DELETE',
      body: JSON.stringify({ videoId }),
    });
  },

  search: async (query: string): Promise<ApiSuccessResponse> => {
    const cleanQuery = query.trim();
    const endpoint = `${API_ROUTES.VIDEOS.SEARCH}?${SEARCH.QUERY_PARAM}=${encodeURIComponent(cleanQuery)}&page=1`;

    return apiFetch<ApiSuccessResponse>(endpoint, {
      method: 'GET',
    });
  },
};
