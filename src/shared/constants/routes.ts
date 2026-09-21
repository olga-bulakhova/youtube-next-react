/**
 * 🗺️ КОНСТАНТЫ КЛИЕНТСКИХ СТРАНИЦ (Навигация в браузере)
 */
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
} as const;

/**
 * 🔌 КОНСТАНТЫ БЭКЕНД-ЭНДПОИНТОВ (Запросы к API)
 */
export const API_ROUTES = {
  VIDEOS: {
    BASE: '/api/videos',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
} as const;
