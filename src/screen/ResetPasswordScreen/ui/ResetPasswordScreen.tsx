'use client';

import React from 'react';
import { FormInput, FormCard } from '@/shared/ui/form';
import { Button } from '@/shared/ui/Button';
import { useResetPasswordForm } from '../model/useResetPasswordForm';
import { BackButton } from '@/shared/ui/BackButton';

export const ResetPasswordScreen = () => {
  const { onSubmit, handleSubmit, hasToken, ...form } = useResetPasswordForm();

  return (
    <FormCard
      title="Установка нового пароля"
      subtitle="Придумайте надежный пароль для защиты вашего аккаунта"
      maxWidthClassName="max-w-md"
    >
      {!hasToken ? (
        <div className="py-6 text-center">
          <p className="text-sm font-medium text-red-500">
            Критическая ошибка доступа
          </p>
          <p className="mt-2 mb-6 text-xs text-zinc-400">
            Секретный ключ не найден. Пожалуйста, перейдите по ссылке строго из
            письма.
          </p>
          <BackButton label="Вернуться на главную" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
          <FormInput
            id="password"
            label="Новый пароль"
            type="password"
            placeholder="Введите минимум 6 символов..."
            autoComplete="new-password"
            error={form.errors.password?.message}
            {...form.register('password')}
          />

          <FormInput
            id="confirmPassword"
            label="Повторите новый пароль"
            type="password"
            placeholder="Введите пароль еще раз..."
            autoComplete="new-password"
            error={form.errors.confirmPassword?.message}
            {...form.register('confirmPassword')}
          />

          <div className="mt-6 flex justify-end">
            <Button
              isLoading={form.isSubmitting}
              loadingText="Обновление..."
              type="submit"
              className="px-6"
            >
              Сохранить пароль
            </Button>
          </div>
        </form>
      )}
    </FormCard>
  );
};
