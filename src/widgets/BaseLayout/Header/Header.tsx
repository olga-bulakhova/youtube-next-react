import { MainLogo } from '@/shared/ui/MainLogo';
import { SidebarToggle } from '../SidebarToggle';
import { UserMenu } from './UserMenu/ui/UserMenu';
import { serverCookies } from '@/shared/utils-server';
import { APP_ROUTES } from '@/shared/constants';
import { ProfileIcon } from '@/shared/icons';
import { Button } from '@/shared/ui/Button';

export const Header = async () => {
  const user = await serverCookies.getUser();
  const username = user?.username || '';
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
            <Button
              href={APP_ROUTES.ADD_VIDEO}
              icon={<span className="text-2xl leading-none font-light">+</span>}
            >
              Добавить
            </Button>

            <UserMenu firstLetter={firstLetter} username={username} />
          </div>
        ) : (
          <Button
            href={APP_ROUTES.AUTH.LOGIN}
            icon={
              <ProfileIcon className="h-5 w-5 opacity-70 transition-opacity duration-200 group-hover:opacity-100" />
            }
          >
            Войти
          </Button>
        )}
      </div>
    </header>
  );
};
