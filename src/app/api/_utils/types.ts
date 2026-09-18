export interface IVideoItem {
  videoId: string;
  title: string;
  authorName: string;
  authorUrl: string;
  category: string;
}

export interface PostRequestBody {
  videoId: string;
  category: string;
}

export interface ApiSuccessResponse {
  ok: true;
  videos: IVideoItem[];
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
}
