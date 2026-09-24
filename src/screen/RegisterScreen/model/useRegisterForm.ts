'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/api/auth';
import { getErrorMessage } from '@/shared/utils-client';
import { APP_ROUTES } from '@/shared/constants';

const schema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Логин должен содержать минимум 3 символа' }),
    email: z
      .string()
      .min(1, { message: 'Email обязателен для заполнения' })
      .email({ message: 'Введите корректный адрес электронной почты' }),
    password: z
      .string()
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

export const useRegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await authApi.register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      });

      router.replace(APP_ROUTES.HOME);
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Не удалось связаться с сервером. Попробуйте позже.',
      );

      if (message.toLowerCase().includes('email')) {
        console.log('email', message);

        setError('email', {
          type: 'server',
          message,
        });
      } else {
        setError('username', {
          type: 'server',
          message,
        });
      }
    }
  };

  return {
    onSubmit,
    handleSubmit,
    errors,
    register,
    isSubmitting,
  };
};
