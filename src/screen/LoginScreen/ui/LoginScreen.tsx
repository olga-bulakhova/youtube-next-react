

'use client';

import { FormButton, FormInput } from '@/shared/ui/form-controls';
import Link from 'next/link';
import { useLoginForm } from '../model/useLoginForm';

export const LoginScreen = () => {
  const { onSubmit, handleSubmit, ...form } = useLoginForm();

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Войти в аккаунт
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            чтобы управлять вашей коллекцией видео
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
          <FormInput
            id="username"
            label="Логин или Email"
            placeholder="Введите ваш логин..."
            autoComplete="username"
            error={form.errors.username?.message}
            {...form.register('username')}
          />

          <FormInput
            id="password"
            label="Пароль"
            type="password"
            placeholder="Введите ваш пароль..."
            autoComplete="current-password"
            error={form.errors.password?.message}
            {...form.register('password')}
          />

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              href="/auth/register"
              className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
            >
              Создать аккаунт
            </Link>

            <FormButton
              isLoading={form.isSubmitting}
              loadingText="Вход..."
              className="px-6"
            >
              Войти
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};
