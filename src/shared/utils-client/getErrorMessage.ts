/**
 * 🛠 УНИВЕРСАЛЬНАЯ УТИЛИТА: Безопасно извлекает текст ошибки из блока catch.
 * Избавляет от необходимости писать instanceof Error во всех файлах проекта.
 *
 * @param error - Ошибка из блока catch (тип unknown)
 * @param fallbackMessage - Текст ошибки по умолчанию, если стандартное сообщение отсутствует
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = 'Произошла непредвиденная ошибка',
): string => {
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  // Если ошибка прилетела в нестандартном формате (например, просто строка или объект)
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message) || fallbackMessage;
  }

  return fallbackMessage;
};
