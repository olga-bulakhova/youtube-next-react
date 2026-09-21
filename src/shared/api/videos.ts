import { ApiSuccessResponse } from '@/app/api/videos/_storage/types';
import { apiFetch } from './baseClient'; // Импортируем нашу общую утилиту

interface AddVideoPayload {
  videoId: string;
  category: string;
}

export const videosApi = {
  /**
   * Получить список всех видеороликов (GET)
   */
  getAll: async (): Promise<ApiSuccessResponse> => {
    return apiFetch<ApiSuccessResponse>('/api/videos', {
      method: 'GET',
      next: { revalidate: 0 }, // Отключаем кэш в Next.js 16
    });
  },

  /**
   * Добавить новое видео в коллекцию (POST)
   */
  add: async (payload: AddVideoPayload): Promise<ApiSuccessResponse> => {
    return apiFetch<ApiSuccessResponse>('/api/videos', {
      method: 'POST',
      body: JSON.stringify(payload), // Заголовки Content-Type подставятся автоматически! 🛡️
    });
  },

  /**
   * Удалить видео из коллекции (DELETE)
   */
  delete: async (videoId: string): Promise<ApiSuccessResponse> => {
    return apiFetch<ApiSuccessResponse>('/api/videos', {
      method: 'DELETE',
      body: JSON.stringify({ videoId }),
    });
  },
};
