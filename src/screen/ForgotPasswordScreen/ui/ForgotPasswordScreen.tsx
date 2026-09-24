'use client';

import React from 'react';
import { FormInput, FormCard } from '@/shared/ui/form';
import { Button } from '@/shared/ui/Button';
import { BackButton } from '@/shared/ui/BackButton';
import { useForgotPasswordForm } from '../model/useForgotPasswordForm';

export const ForgotPasswordScreen = () => {
  const { onSubmit, handleSubmit, isSuccess, ...form } =
    useForgotPasswordForm();

  return (
    <FormCard
      title="Восстановление пароля"
      subtitle="Введите вашу электронную почту для получения секретной ссылки"
      maxWidthClassName="max-w-md"
    >
      {isSuccess ? (
        <div className="animate-in fade-in flex flex-col items-center py-4 text-center duration-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 select-none">
            ✓
          </div>
          <p className="text-sm font-semibold text-emerald-400">
            Ссылка успешно отправлена!
          </p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-zinc-400">
            Проверьте ваш почтовый ящик. Мы отправили вам письмо с инструкциями
            по установке нового пароля. Ссылка будет действительна в течение 1
            часа.
          </p>
          <div className="mt-6">
            <BackButton label="Вернуться к авторизации" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
          <FormInput
            id="email"
            label="Электронная почта (Email)"
            type="email"
            placeholder="example@mail.com"
            autoComplete="email"
            error={form.errors.email?.message}
            {...form.register('email')}
          />

          <div className="mt-6 flex items-center justify-between gap-4">
            <BackButton label="Назад" />

            <Button
              isLoading={form.isSubmitting}
              loadingText="Отправка..."
              type="submit"
              className="px-6"
            >
              Сбросить пароль
            </Button>
          </div>
        </form>
      )}
    </FormCard>
  );
};
