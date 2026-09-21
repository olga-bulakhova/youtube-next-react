'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getYouTubeVideoId,
  isYouTubeDomain,
  getErrorMessage,
} from '@/shared/utils';
import { videosApi } from '@/shared/api/videos';

const schema = z.object({
  videoUrl: z
    .string()
    .min(1, { message: 'Введите ссылку на видео' })
    .refine((url) => !url || isYouTubeDomain(url), {
      message: 'Введите корректную ссылку на видео YouTube',
    }),
  category: z.string().nonempty({ message: 'Выберите категорию для видео' }),
});

type Inputs = z.infer<typeof schema>;

export const useAddVideoForm = () => {
  const [videoId, setVideoId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
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

      setVideoId(currentVideoId);
      reset();
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Не удалось связаться с сервером. Попробуйте позже.',
      );

      setError('videoUrl', {
        type: 'server',
        message,
      });
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
