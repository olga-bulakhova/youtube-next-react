/**
 * Устанавливает куку в браузере (Клиентский метод)
 */
export const setClientCookie = (
  name: string,
  value: string,
  days = 7,
): void => {
  if (typeof window === 'undefined') return; // Защита от запуска на сервере

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
};

/**
 * Записывает сложный объект в куки, автоматически сериализуя его в JSON (Клиентский метод)
 */
export const setClientJsonCookie = (
  name: string,
  data: unknown,
  days = 7,
): void => {
  try {
    const jsonString = JSON.stringify(data);
    const encodedValue = encodeURIComponent(jsonString);
    setClientCookie(name, encodedValue, days);
  } catch (error) {
    console.error(`Ошибка записи JSON в куку ${name}:`, error);
  }
};

/**
 * Читает и автоматически парсит JSON из куки (Серверный или Клиентский метод)
 * Поддерживает как сырую строку из document.cookie, так и значение из next/headers
 */
export const parseJsonCookie = <T>(
  cookieValue: string | undefined,
): T | null => {
  if (!cookieValue) return null;

  try {
    const decodedValue = decodeURIComponent(cookieValue);
    return JSON.parse(decodedValue) as T;
  } catch (error) {
    console.error('Ошибка парсинга JSON из куки:', error);
    return null;
  }
};

/**
 * Стирает авторизационные куки токена и профиля пользователя (Клиентский метод)
 */
export const removeClientAuthCookies = (): void => {
  if (typeof window === 'undefined') return;

  // Выставляем max-age=0, чтобы браузер мгновенно удалил записи
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax; Secure';
  document.cookie = 'user=; path=/; max-age=0; SameSite=Lax; Secure';
};
