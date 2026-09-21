import 'server-only';
import { serverEnv } from './serverEnv';

interface VideoCheckResult {
  allowed: boolean;
  reason?: 'NOT_FOUND' | 'EMBED_DISABLED' | 'AGE_RESTRICTED' | 'UNKNOWN_ERROR';
  details?: string;
}

// Описываем структуру ответа YouTube Data API v3 для строгой типизации
interface YouTubeApiResponse {
  items?: Array<{
    status?: {
      embeddable?: boolean;
    };
    contentDetails?: {
      contentRating?: {
        ytRating?: string;
      };
    };
  }>;
}

/**
 * Проверяет YouTube видео на возможность встраивания и возрастные ограничения через официальный Google API.
 * Вызывать строго на бэкенде (серверная сторона)!
 */
export async function checkYoutubeVideo(
  videoId: string,
): Promise<VideoCheckResult> {
  const apiKey = serverEnv.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error(
      'Ошибка конфигурации: Переменная YOUTUBE_API_KEY не задана в .env',
    );
    return {
      allowed: false,
      reason: 'UNKNOWN_ERROR',
      details: 'Missing server API key',
    };
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails,status`;

    const response = await fetch(url, {
      // Кэшируем результат на 1 час (3600 сек), чтобы жестко экономить бесплатные квоты Google API
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`YouTube API returned status ${response.status}`);
    }

    const data: YouTubeApiResponse = await response.json();

    // 1. Проверяем, существует ли видео вообще
    if (!data.items || data.items.length === 0) {
      return {
        allowed: false,
        reason: 'NOT_FOUND',
        details: 'Video not found or is private',
      };
    }

    const video = data.items[0];
    const embeddable = video.status?.embeddable;
    const ytRating = video.contentDetails?.contentRating?.ytRating;

    console.log(video);
    console.log(embeddable);
    console.log(ytRating);

    // 2. Проверяем запрет автора на встраивание плеера на сторонних сайтах
    if (embeddable === false) {
      return {
        allowed: false,
        reason: 'EMBED_DISABLED',
        details: 'Embedding is disabled by owner',
      };
    }

    // 3. Проверяем наличие возрастного ограничения (18+ / Sign in to confirm your age)
    if (ytRating === 'ytAgeRestricted') {
      return {
        allowed: false,
        reason: 'AGE_RESTRICTED',
        details: 'Video is age restricted',
      };
    }

    // Если все проверки успешно пройдены
    return { allowed: true };
  } catch (error) {
    console.error(`Ошибка при проверке видео ${videoId}:`, error);
    return {
      allowed: false,
      reason: 'UNKNOWN_ERROR',
      details: error instanceof Error ? error.message : 'Fetch failed',
    };
  }
}
