'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getErrorMessage } from '@/shared/utils-client';
import { authApi } from '@/shared/api';

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'Электронная почта обязательна для заполнения' })
    .email({ message: 'Введите корректный адрес электронной почты' }), // 🌟 Строгая валидация почты [0.1]
});

type Inputs = z.infer<typeof schema>;

export const useForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await authApi.forgotPassword({ email: formData.email.trim() });
      setIsSuccess(true);
      setIsSuccess(true);
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Не удалось отправить инструкцию. Попробуйте позже.',
      );

      setError('email', {
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
    isSuccess,
  };
};
