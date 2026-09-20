'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { setClientCookie, setClientJsonCookie } from '@/shared/utils';

const schema = z.object({
  username: z
    .string()
    .min(1, { message: 'Введите имя пользователя' })
    .min(3, { message: 'Имя пользователя должно содержать минимум 3 символа' }),
  password: z
    .string()
    .min(1, { message: 'Введите пароль' })
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
});

type Inputs = z.infer<typeof schema>;

export const useLoginForm = () => {
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
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const payload = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        setError('username', {
          type: 'server',
          message: data.error || 'Произошла ошибка при входе в систему',
        });
        return;
      }

      console.log('[AUTH] Успешный рантайм входа. Получен токен:', data.token);

      setClientCookie('token', data.token);
      setClientJsonCookie('user', data.user);

      router.replace('/');
      // router.refresh(); // Обновляем серверные компоненты лэйаута, чтобы обновить состояние хедера
    } catch (error) {
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
