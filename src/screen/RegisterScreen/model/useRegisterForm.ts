'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { setClientCookie, setClientJsonCookie } from '@/shared/utils/cookies';

const schema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Логин должен содержать минимум 3 символа' }),
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
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const payload = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setError('username', {
          type: 'server',
          message: data.error || 'Ошибка при регистрации',
        });
        return;
      }

      console.log(
        '[AUTH] Успешная регистрация. Данные сессии сохранены в cookies',
      );

      setClientCookie('token', data.token);
      setClientJsonCookie('user', data.user);

      router.replace('/');
    } catch (_) {
      setError('username', {
        type: 'server',
        message: 'Не удалось связаться с сервером. Попробуйте позже.',
      });
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
