'use client';

import { FormInput, FormCard } from '@/shared/ui/form'; // Подключаем FormCard
import Link from 'next/link';
import { APP_ROUTES } from '@/shared/constants/routes';
import { useLoginForm } from '../model/useLoginForm';
import { Button } from '@/shared/ui/Button';

export const LoginScreen = () => {
  const { onSubmit, handleSubmit, ...form } = useLoginForm();

  return (
    <FormCard
      title="Войти в аккаунт"
      subtitle="чтобы управлять вашей коллекцией видео"
      maxWidthClassName="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <FormInput
          id="username"
          label="Логин или Email"
          placeholder="Введите ваш логин..."
          error={form.errors.username?.message}
          {...form.register('username')}
        />

        <FormInput
          id="password"
          label="Пароль"
          type="password"
          placeholder="Введите ваш пароль..."
          error={form.errors.password?.message}
          {...form.register('password')}
        />

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            href={APP_ROUTES.AUTH.REGISTER}
            className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
          >
            Создать аккаунт
          </Link>

          <Button
            isLoading={form.isSubmitting}
            loadingText="Вход..."
            type="submit"
            className="px-6"
          >
            Войти
          </Button>
        </div>
      </form>
    </FormCard>
  );
};
