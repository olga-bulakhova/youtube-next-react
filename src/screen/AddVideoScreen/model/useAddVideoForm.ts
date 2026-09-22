'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getYouTubeVideoId,
  isYouTubeDomain,
  getErrorMessage,
} from '@/shared/utils-client';
import { videosApi } from '@/shared/api/videos';
import { useUi } from '@/shared/context/UiContext';

const ADD_VIDEO_MESSAGES = {
  VALIDATION: {
    URL_REQUIRED: 'Введите ссылку на видео',
    INVALID_YOUTUBE: 'Введите корректную ссылку на видео YouTube',
    CATEGORY_REQUIRED: 'Выберите категорию для видео',
  },
  SERVER: {
    SUCCESS: 'Видео успешно добавлено в вашу коллекцию!',
    DEFAULT_ERROR: 'Не удалось связаться с сервером. Попробуйте позже.',
  },
} as const;

const schema = z.object({
  videoUrl: z
    .string()
    .min(1, { message: ADD_VIDEO_MESSAGES.VALIDATION.URL_REQUIRED })
    .refine((url) => !url || isYouTubeDomain(url), {
      message: ADD_VIDEO_MESSAGES.VALIDATION.INVALID_YOUTUBE,
    }),
  category: z
    .string()
    .nonempty({ message: ADD_VIDEO_MESSAGES.VALIDATION.CATEGORY_REQUIRED }),
});

type Inputs = z.infer<typeof schema>;

export const useAddVideoForm = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const { showToast } = useUi(); // Подключаем метод отображения Toast-уведомлений

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      videoUrl: '',
      category: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ videoUrl, category }) => {
    const currentVideoId = getYouTubeVideoId(videoUrl);

    if (!currentVideoId) return;

    try {
      await videosApi.add({
        videoId: currentVideoId,
        category,
      });

      showToast(ADD_VIDEO_MESSAGES.SERVER.SUCCESS, 'success');

      setVideoId(currentVideoId);
      reset();
    } catch (error) {
      const message = getErrorMessage(
        error,
        ADD_VIDEO_MESSAGES.SERVER.DEFAULT_ERROR,
      );

      showToast(message, 'error');
    }
  };

  return {
    videoId,
    onSubmit,
    handleSubmit,
    errors,
    register,
    isSubmitting,
  };
};
