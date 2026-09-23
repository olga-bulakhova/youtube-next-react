import 'server-only';
import { serverEnv } from './serverEnv';
import { YOUTUBE_ROUTES } from '../constants';

interface VideoInfo {
  title?: string;
  authorName?: string;
  authorUrl?: string;
}

interface VideoCheckResult {
  allowed: boolean;
  reason?: 'NOT_FOUND' | 'EMBED_DISABLED' | 'AGE_RESTRICTED' | 'UNKNOWN_ERROR';
  details?: string;
  info?: VideoInfo;
}

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
    sidebar?: {
      title?: string;
      channelTitle?: string;
      channelId?: string;
    };
    snippet?: {
      title?: string;
      channelTitle?: string;
      channelId?: string;
    };
  }>;
}

export async function fetchVideoInfoFromOEmbed(
  videoId: string,
): Promise<VideoInfo | null> {
  try {
    const url = YOUTUBE_ROUTES.EMBED(videoId);
    const rawResult = await fetch(url);

    if (rawResult.ok) {
      const videoInfo = await rawResult.json();
      return {
        title: videoInfo.title,
        authorName: videoInfo.author_name || 'Неизвестный автор',
        authorUrl: videoInfo.author_url || '',
      };
    }
  } catch (oembedError) {
    console.error(
      '[YOUTUBE_CHECK_FATAL] Резервный oEmbed фолбэк завершился ошибкой:',
      oembedError,
    );
  }
  return null;
}

export async function checkYoutubeVideo(
  videoId: string,
): Promise<VideoCheckResult> {
  const apiKey = serverEnv.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error(
      '[YOUTUBE_CHECK_ERROR] Переменная YOUTUBE_API_KEY не задана в .env',
    );
    return {
      allowed: false,
      reason: 'UNKNOWN_ERROR',
      details: 'Missing server API key',
    };
  }

  try {
    const url = YOUTUBE_ROUTES.VIDEO_CHECK(videoId, apiKey);
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      throw new Error(`YouTube API returned status ${response.status}`);
    }

    const data: YouTubeApiResponse = await response.json();

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
    const snippet = video.snippet;

    console.log(
      '[YOUTUBE_CHECK] Успешно получены данные через Data API:',
      snippet,
    );

    if (embeddable === false) {
      return {
        allowed: false,
        reason: 'EMBED_DISABLED',
        details: 'Embedding is disabled by owner',
      };
    }

    if (ytRating === 'ytAgeRestricted') {
      return {
        allowed: false,
        reason: 'AGE_RESTRICTED',
        details: 'Video is age restricted',
      };
    }

    return {
      allowed: true,
      info: {
        title: snippet?.title,
        authorName: snippet?.channelTitle,
        authorUrl: snippet?.channelId
          ? YOUTUBE_ROUTES.CHANNEL(snippet.channelId)
          : '',
      },
    };
  } catch (apiError) {
    console.warn(
      `[YOUTUBE_CHECK] Основной API недоступен для видео ${videoId}, переключаемся на oEmbed...`,
    );

    const oembedInfo = await fetchVideoInfoFromOEmbed(videoId);

    if (oembedInfo) {
      return {
        allowed: true,
        info: oembedInfo,
      };
    }

    return {
      allowed: false,
      reason: 'UNKNOWN_ERROR',
      details: apiError instanceof Error ? apiError.message : 'Fetch failed',
    };
  }
}
