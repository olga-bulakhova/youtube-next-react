'use client';

import { MenuLink } from './MenuLink';
import { AddIcon } from '@/shared/icons/AddIcon';
import { useSidebar } from '../SidebarContext';
import { MainLogo } from '@/shared/ui/MainLogo';
import { IUserCookie } from '@/app/api/auth/_storage/types';
import { SidebarToggle } from '../SidebarToggle';
import { HomeIcon, ProfileIcon, VideoIcon } from '@/shared/icons';
import { APP_ROUTES } from '@/shared/constants';

type LeftMenuProps = {
  user: IUserCookie | null;
};

export const LeftMenu = ({ user }: LeftMenuProps) => {
  const { closeSidebar } = useSidebar();

  const menuItems = [
    { href: APP_ROUTES.HOME, icon: HomeIcon, label: 'Главная' },
    { href: APP_ROUTES.VIDEOS, icon: VideoIcon, label: 'Видеотека' },
    ...(user
      ? [
          {
            href: APP_ROUTES.PROFILE,
            icon: ProfileIcon,
            label: 'Профиль',
          },
        ]
      : []),
    { href: APP_ROUTES.ADD_VIDEO, icon: AddIcon, label: 'Добавить видео' },
    { href: APP_ROUTES.MY_VIDEOS, icon: VideoIcon, label: 'Ваши видео' },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3 px-2 pb-2">
        <SidebarToggle />
        <MainLogo />
      </div>

      <nav onClick={closeSidebar} className="flex w-full flex-col gap-1">
        {menuItems.map((item) => (
          <MenuLink
            key={item.href + item.label}
            href={item.href}
            icon={item.icon}
            alt={item.label}
          >
            {item.label}
          </MenuLink>
        ))}
      </nav>
    </div>
  );
};
