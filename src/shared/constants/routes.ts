export const APP_ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  MY_VIDEOS: '/my-videos',
  ADD_VIDEO: '/editor/add-video',

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  VIDEO: (videoId: string) => `/video/${videoId}`,
  CATEGORY: (categoryId: string) => `/category/${categoryId}`,
  MY_VIDEOS_CATEGORY: (categoryId: string) =>
    `/my-videos/category/${categoryId}`,
  SEARCH: (query: string) =>
    `/search?search=${encodeURIComponent(query.trim())}&page=1`,
} as const;

export const API_ROUTES = {
  VIDEOS: {
    BASE: '/api/videos',
    BY_ID: (videoId: string) => `/api/videos/${videoId}`,
    SEARCH: '/api/videos/search',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
} as const;

export const YOUTUBE_ROUTES = {
  VIDEO_CHECK: (videoId: string, apiKey: string) =>
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,status`,
  EMBED: (videoId: string) =>
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
  CHANNEL: (channelId: string) => `https://youtube.com/channel/${channelId}`,
};
