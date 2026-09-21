import {
  withServerAuth,
  AuthenticatedPageProps,
} from '@/shared/hoc/withServerAuth/withServerAuth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Настройки профиля',
};

// 🌟 ИСПРАВЛЕНО: Страница теперь строго статическая. Никаких параметров из URL!
function ProfilePage({ user }: AuthenticatedPageProps) {
  const { username, userId } = user;

  return (
    <div className="max-w-2xl p-6">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Настройки аккаунта
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Управляйте вашими личными данными и конфигурацией интерфейса
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-medium text-white">
          Личная информация
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <span className="mb-1 block text-xs text-zinc-500">
              Имя пользователя (Логин)
            </span>
            <span className="block rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200">
              {username}
            </span>
          </div>

          <div>
            <span className="mb-1 block text-xs text-zinc-500">
              Системный идентификатор (User ID)
            </span>
            <span className="inline-block rounded-md border border-zinc-800/60 bg-zinc-900/50 px-3 py-1.5 font-mono text-sm text-zinc-400">
              #{userId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withServerAuth(ProfilePage);
