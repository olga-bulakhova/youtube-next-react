'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/api/auth';
import { getErrorMessage } from '@/shared/utils-client';

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
    try {
      await authApi.login({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });
      router.replace('/');
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось войти в систему');
      setError('username', {
        type: 'server',
        message: message,
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
