'use client';

import { getYouTubeVideoId, isYouTubeDomain } from '@/shared/libs';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
      const res = await fetch('/api/videos', {
        method: 'POST',
        body: JSON.stringify({ videoId: currentVideoId, category, userId: 2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setError('videoUrl', {
          type: 'server',
          message: data.error || 'Произошла ошибка при добавлении видео',
        });
        return;
      }

      setVideoId(currentVideoId);
      reset();
    } catch (error) {
      setError('videoUrl', {
        type: 'server',
        message: 'Не удалось связаться с сервером. Попробуйте позже.',
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
