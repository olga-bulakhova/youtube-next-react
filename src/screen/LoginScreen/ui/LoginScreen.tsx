'use client';

import { FormInput, FormCard } from '@/shared/ui/form';
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
      className="py-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <FormInput
          id="email"
          label="Email"
          placeholder="Введите ваш email..."
          error={form.errors.email?.message}
          {...form.register('email')}
        />

        <div className="flex flex-col gap-1">
          <FormInput
            id="password"
            label="Пароль"
            type="password"
            placeholder="Введите ваш пароль..."
            error={form.errors.password?.message}
            {...form.register('password')}
          />

          <div className="px-1 text-right">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
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
            variant="success"
            className="min-w-30 px-6"
          >
            Войти
          </Button>
        </div>
      </form>
    </FormCard>
  );
};
