'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { getErrorMessage } from '@/shared/utils-client';
import { APP_ROUTES } from '@/shared/constants';

const schema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'Введите новый пароль' })
      .min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Повторите введенный пароль' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type Inputs = z.infer<typeof schema>;

export const useResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (!token) {
      setError('password', {
        type: 'manual',
        message: 'Токен восстановления отсутствует или недействителен.',
      });
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Не удалось обновить пароль');
      }

      router.replace(APP_ROUTES.AUTH.LOGIN);
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Ссылка устарела или токен уже был использован.',
      );

      setError('password', {
        type: 'server',
        message,
      });
    }
  };

  return {
    onSubmit,
    handleSubmit,
    errors,
    register,
    isSubmitting,
    hasToken: !!token,
  };
};
