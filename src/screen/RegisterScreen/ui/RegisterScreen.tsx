'use client';

import { FormInput, FormCard } from '@/shared/ui/form';
import Link from 'next/link';
import { useRegisterForm } from '../model/useRegisterForm';
import { APP_ROUTES } from '@/shared/constants';
import { Button } from '@/shared/ui/Button';

export const RegisterScreen = () => {
  const { onSubmit, handleSubmit, ...form } = useRegisterForm();

  return (
    <FormCard
      title="Создать аккаунт"
      subtitle="зарегистрируйтесь, чтобы сохранять свои видео"
      maxWidthClassName="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <FormInput
          id="username"

          label="Имя пользователя"
          placeholder="Придумайте логин..."
          autoComplete="username"
          error={form.errors.username?.message}
          {...form.register('username')}
        />

        <FormInput
          id="email"
          label="Электронная почта (Email)"
          placeholder="example@mail.com"
          autoComplete="email"
          error={form.errors.email?.message}
          {...form.register('email')}
        />

        <FormInput
          id="password"
          label="Пароль"
          type="password"
          placeholder="Придумайте надежный пароль..."
          autoComplete="new-password"
          error={form.errors.password?.message}
          {...form.register('password')}
        />

        <FormInput
          id="confirmPassword"
          label="Повторите пароль"
          type="password"
          placeholder="Введите пароль еще раз..."
          autoComplete="new-password"
          error={form.errors.confirmPassword?.message}
          {...form.register('confirmPassword')}
        />

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            href={APP_ROUTES.AUTH.LOGIN}
            className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
          >
            Уже есть аккаунт?
          </Link>

          <Button
            isLoading={form.isSubmitting}
            loadingText="Регистрация..."
            variant="success"
            type="submit"
            className="min-w-30 px-6"
          >
            Создать
          </Button>
        </div>
      </form>
    </FormCard>
  );
};
