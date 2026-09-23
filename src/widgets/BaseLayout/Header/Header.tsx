import { MainLogo } from '@/shared/ui/MainLogo';
import { SidebarToggle } from '../SidebarToggle';
import { UserMenu } from './UserMenu/ui/UserMenu';
import { serverCookies } from '@/shared/utils-server';
import { APP_ROUTES } from '@/shared/constants';
import { ProfileIcon } from '@/shared/icons';
import { Button } from '@/shared/ui/Button';
import { SearchInput } from '@/shared/ui/SearchInput';

export const Header = async () => {
  const user = await serverCookies.getUser();
  const username = user?.username || '';
  const firstLetter = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="flex flex-wrap items-center justify-between py-4 md:flex-nowrap">
      <div className="order-1 flex items-center gap-3">
        <SidebarToggle />
        <MainLogo />
      </div>

      <div className="order-3 mt-3 flex min-w-full flex-1 justify-center md:order-2 md:mt-0 md:min-w-auto">
        <SearchInput />
      </div>

      <div className="order-2 flex items-center gap-4 md:order-3">
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
