//import { clientEnv } from '../utils-client';

const BASE_URL = '';

export const createHeaders = (
  customHeaders?: HeadersInit,
  hasBody = false,
): HeadersInit => {
  const baseHeaders: Record<string, string> = {};
  if (hasBody) {
    baseHeaders['Content-Type'] = 'application/json';
  }
  return { ...baseHeaders, ...customHeaders };
};

export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Ошибка сервера: ${response.status}`);
  }
  return data as T;
}

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
