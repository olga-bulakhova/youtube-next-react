import Link from 'next/link';
import { MainLogo } from '@/shared/ui/MainLogo';
import { SidebarToggle } from '../SidebarToggle';
import { UserMenu } from './UserMenu/ui/UserMenu';
import { serverCookies } from '@/shared/utils-server';
import { APP_ROUTES } from '@/shared/constants';
import { ProfileIcon } from '@/shared/icons';

export const Header = async () => {
  const user = await serverCookies.getUser();
  const username = user?.username || '';
  const firstLetter = username ? username.charAt(0).toUpperCase() : '';

  const BUTTON_STYLES =
    'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/15';

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <MainLogo />
      </div>

      <div className="flex items-center gap-4">
        {username ? (
          <div className="flex items-center gap-4">
            <Link href={APP_ROUTES.ADD_VIDEO} className={BUTTON_STYLES}>
              <span className="mb-1 text-2xl leading-none font-light">+</span>
              <span>Добавить</span>
            </Link>

            <UserMenu firstLetter={firstLetter} username={username} />
          </div>
        ) : (
          <Link href={APP_ROUTES.AUTH.LOGIN} className={BUTTON_STYLES}>
            <ProfileIcon className="h-5 w-5 opacity-70 transition-opacity duration-200 group-hover:opacity-100" />
            <span className="text-sm font-medium">Войти</span>
          </Link>
        )}
      </div>
    </header>
  );
};
