'use client';

import { MenuLink } from './MenuLink';
import HomeIcon from '@/shared/assets/icons/home.svg';
import ProfileIcon from '@/shared/assets/icons/profile.svg';
import AddIcon from '@/shared/assets/icons/add.svg';
import VideoIcon from '@/shared/assets/icons/video.svg';
import { useSidebar } from '../SidebarContext';
import { MainLogo } from '@/shared/ui/MainLogo';
import { IUserCookie } from '@/app/api/auth/_storage/types';
import { SidebarToggle } from '../SidebarToggle';

type LeftMenuProps = {
  user: IUserCookie | null;
};

export const LeftMenu = ({ user }: LeftMenuProps) => {
  const { closeSidebar } = useSidebar();

  const profileId = user ? String(user.id) : null;

  const menuItems = [
    { href: '/', icon: HomeIcon, alt: 'Home', label: 'Главная' },
    ...(profileId
      ? [
          {
            href: `/profile/${profileId}`,
            icon: ProfileIcon,
            alt: 'Profile',
            label: 'Профиль',
          },
        ]
      : []),
    {
      href: '/editor/add-video',
      icon: AddIcon,
      alt: 'Add',
      label: 'Добавить видео',
    },
    {
      href: '/my-videos',
      icon: VideoIcon,
      alt: 'Videos',
      label: 'Ваши видео',
    },
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
            alt={item.alt}
          >
            {item.label}
          </MenuLink>
        ))}
      </nav>
    </div>
  );
};
