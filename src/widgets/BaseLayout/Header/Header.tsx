import Link from 'next/link';
import { MainLogo } from '@/shared/ui/MainLogo';
import { SidebarToggle } from '../SidebarToggle';
import { UserMenu } from './UserMenu/ui/UserMenu';
import { serverCookies } from '@/shared/utils-server';

export const Header = async () => {
  const user = await serverCookies.getUser();
  const username = user?.username || '';
  const profileId = user ? String(user.id) : '';
  const firstLetter = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <MainLogo />
      </div>

      <div className="flex items-center gap-4">
        {username ? (
          <div className="flex items-center gap-4">
            <Link
              href="/editor/add-video"
              className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
            >
              <span className="mb-1 text-2xl leading-none font-light">+</span>
              <span>Добавить</span>
            </Link>

            <UserMenu
              firstLetter={firstLetter}
              username={username}
              profileId={profileId}
            />
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
          >
            <span>Войти</span>
          </Link>
        )}
      </div>
    </header>
  );
};
