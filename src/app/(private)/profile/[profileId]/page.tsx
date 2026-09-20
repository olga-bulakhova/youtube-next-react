import {
  AuthenticatedPageProps,
  withServerAuth,
} from '@/shared/hoc/withServerAuth/withServerAuth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профиль',
};

type ProfilePageProps = {
  params: Promise<{ profileId: string }>;
};

async function ProfilePage({
  params,
  user,
}: ProfilePageProps & AuthenticatedPageProps) {
  const { profileId } = await params;

  const { userId, username } = user;

  const isOwnProfile = String(userId) === profileId;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-white">Страница профиля</h1>
      <p className="text-zinc-400">
        ID просматриваемого профиля:{' '}
        <span className="font-medium text-white">{profileId}</span>
      </p>

      {isOwnProfile ? (
        <p className="mt-2 text-sm text-emerald-400">
          ✨ Вы просматриваете свой собственный профиль, {username}!
        </p>
      ) : (
        <p className="mt-2 text-sm text-zinc-500">
          Вы зашли как гость на страницу другого автора.
        </p>
      )}
    </div>
  );
}

// 3. 🌟 ИСПРАВЛЕНО: Оборачиваем страницу перед экспортом в наш гвард
export default withServerAuth(ProfilePage);
