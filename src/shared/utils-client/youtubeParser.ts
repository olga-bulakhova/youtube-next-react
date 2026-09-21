/**
 * Функция для проверки URL и надежного извлечения ID видео YouTube (включая Shorts).
 *
 * @param url - Строка с проверяемым URL-адресом
 * @returns Строку с 11-значным ID видео, если URL валидный, или null
 */

export function isYouTubeDomain(url: string): boolean {
	return /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(url)
}

export function getYouTubeVideoId(url: string): string | null {
	if (!url || typeof url !== 'string') {
		return null
	}

	const trimmedUrl = url.trim()

	// 1. Проверяем принадлежность домена к YouTube

	if (!isYouTubeDomain(trimmedUrl)) {
		return null
	}

	// 2. Универсальное регулярное выражение с поддержкой /shorts/
	// Оно ищет паттерны: watch?v=, v/, embed/, live/, shorts/ или прямую ссылку youtu.be/
	const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|live\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/

	const match = trimmedUrl.match(regex)

	// ID видео в YouTube ВСЕГДА состоит ровно из 11 символов
	if (match && match[1] && match[1].length === 11) {
		return match[1]
	}

	return null
}
