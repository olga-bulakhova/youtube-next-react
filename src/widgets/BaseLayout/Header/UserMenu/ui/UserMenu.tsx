'use client';

import { LogoutIcon, ProfileIcon, VideoIcon } from '@/shared/icons';
import { APP_ROUTES } from '@/shared/constants/routes';
import { useUserMenu } from '../model/useUserMenu';
import { UserMenuItem } from './UserMenuItem';

interface UserMenuProps {
  firstLetter: string;
  username: string;
}

export const UserMenu = ({ firstLetter, username }: UserMenuProps) => {
  const { isOpen, toggleMenu, closeMenu, onLogoutClick } = useUserMenu();

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        title={`Меню пользователя ${username}`}
        className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-emerald-700 font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-emerald-600 focus:outline-none"
      >
        <span className="text-sm select-none">{firstLetter}</span>
      </button>

      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 h-screen w-screen cursor-default"
        />
      )}

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl duration-100">
          <div className="mb-1 border-b border-zinc-800 px-3 py-2">
            <p className="text-xs text-zinc-400">Авторизован как</p>
            <p className="truncate text-sm font-medium text-white">
              {username}
            </p>
          </div>

          <nav className="flex flex-col gap-0.5">
            <UserMenuItem
              href={APP_ROUTES.PROFILE}
              icon={ProfileIcon}
              onClick={closeMenu}
            >
              Мой профиль
            </UserMenuItem>

            <UserMenuItem
              href={APP_ROUTES.MY_VIDEOS}
              icon={VideoIcon}
              onClick={closeMenu}
            >
              Мои видео
            </UserMenuItem>

            <UserMenuItem icon={LogoutIcon} onClick={onLogoutClick}>
              Выйти
            </UserMenuItem>
          </nav>
        </div>
      )}
    </div>
  );
};
