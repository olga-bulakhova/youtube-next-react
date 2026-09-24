import { ResetPasswordScreen } from '@/screen/ResetPasswordScreen';
import { Suspense } from 'react';

export const metadata = {
  title: 'Сброс пароля | Видеотека',
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-sm text-zinc-500">
          Загрузка защищенного соединения...
        </div>
      }
    >
      <ResetPasswordScreen />
    </Suspense>
  );
}