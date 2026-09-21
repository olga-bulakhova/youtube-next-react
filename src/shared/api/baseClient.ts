// Получаем базовый URL из переменной окружения .env
export const BASE_URL = process.env.SERVER_API_URL || 'http://localhost:3000';

/**
 * 🛠 УНИВЕРСАЛЬНЫЙ ХЕЛПЕР: Автоматически собирает заголовки для запроса.
 * Если передано тело (body), по умолчанию добавляет заголовок JSON.
 */
export const createHeaders = (
  customHeaders?: HeadersInit,
  hasBody = false,
): HeadersInit => {
  const baseHeaders: Record<string, string> = {};

  if (hasBody) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  return {
    ...baseHeaders,
    ...customHeaders,
  };
};

/**
 * 🛠 УНИВЕРСАЛЬНЫЙ ХЕЛПЕР: Централизованно обрабатывает ответы от бэкенда.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Ошибка сервера: ${response.status}`);
  }

  return data as T;
}

/**
 * 🚀 ЕДИНЫЙ КЛИЕНТ ЗАПРОСОВ: Обертка над нативным fetch для сокращения кода
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const hasBody = !!options.body;

  const config: RequestInit = {
    ...options,
    headers: createHeaders(options.headers, hasBody),
  };

  const response = await fetch(url, config);
  return handleResponse<T>(response);
};
