'use client';

import { FormButton, FormInput } from '@/shared/ui/form-controls';
import Link from 'next/link';
import { useRegisterForm } from '../model/useRegisterForm';
import { APP_ROUTES } from '@/shared/constants';

export const RegisterScreen = () => {
  const { onSubmit, handleSubmit, ...form } = useRegisterForm();

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Создать аккаунт
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            зарегистрируйтесь, чтобы сохранять свои видео
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
          <FormInput
            id="username"
            label="Имя пользователя или Email"
            placeholder="Придумайте логин..."
            autoComplete="username"
            error={form.errors.username?.message}
            {...form.register('username')}
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

            <FormButton
              isLoading={form.isSubmitting}
              loadingText="Регистрация..."
              className="px-6"
            >
              Создать
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};
