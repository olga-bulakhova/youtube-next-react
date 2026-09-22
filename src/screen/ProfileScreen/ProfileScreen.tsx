import React from 'react';

interface ProfileUserPayload {
  id: number;
  username: string;
  createdAt: string;
}

type ProfileScreenProps = {
  user: ProfileUserPayload;
};

export const ProfileScreen = ({ user }: ProfileScreenProps) => {
  const { username, id, createdAt } = user;

  const registrationDate = createdAt
    ? new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(createdAt))
    : 'Дата неизвестна';

  return (
    <div className="mx-auto max-w-2xl p-4 py-8">
      <div className="mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Личный профиль
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Информация о вашем системном аккаунте и активности в приложении
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-5 divide-y divide-zinc-800/60">
          <div className="flex items-center gap-4 pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-xl font-bold text-zinc-200 shadow-md">
              {username ? username.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <span className="block text-sm font-semibold tracking-wider text-zinc-500">
                Имя пользователя
              </span>
              <span className="text-lg font-semibold text-zinc-100">
                {username}
              </span>
            </div>
          </div>

          <ProfileInfoRow
            title="Идентификатор аккаунта"
            description="Уникальный ID "
          >
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-400">
              #{id}
            </span>
          </ProfileInfoRow>

          <ProfileInfoRow
            title="Дата создания профиля"
            description="Когда вы впервые авторизовались на платформе"
          >
            <span className="text-sm font-medium text-zinc-400">
              {registrationDate}
            </span>
          </ProfileInfoRow>
        </div>
      </div>
    </div>
  );
};

interface ProfileInfoRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ProfileInfoRow = ({
  title,
  description,
  children,
}: ProfileInfoRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      <div>
        <h4 className="text-sm font-medium text-zinc-300">{title}</h4>
        <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
      </div>
      <div className="flex shrink-0 items-center">{children}</div>
    </div>
  );
};
