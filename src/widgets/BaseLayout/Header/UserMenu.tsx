'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeClientAuthCookies } from '@/shared/utils/cookies';
import { LogoutIcon, ProfileIcon } from '@/shared/icons';

interface UserMenuProps {
  firstLetter: string;
  username: string;
  profileId: string;
}

export const UserMenu = ({
  firstLetter,
  username,
  profileId,
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    removeClientAuthCookies();
    closeMenu();

    router.replace('/');
    router.refresh();
  };

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
            <Link
              href={`/profile/${profileId}`}
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ProfileIcon />
              <span>Мой профиль</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
            >
              <LogoutIcon />
              <span>Выйти</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
