export interface IVideoItem {
  videoId: string;
  title: string;
  authorName: string;
  authorUrl: string;
  category: string;
  userId: number;
}

export interface PostRequestBody {
  videoId: string;
  category: string;
  userId: number;
}

export interface ApiSuccessResponse {
  ok: true;
  videos: IVideoItem[];
  total?: number; // 🔥 Добавлено опциональное поле общего количества видео для поддержки пагинации
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
}
