import HomeIcon from '@/shared/assets/icons/home.svg';
import ProfileIcon from '@/shared/assets/icons/profile.svg';
import AddIcon from '@/shared/assets/icons/add.svg';
import VideoIcon from '@/shared/assets/icons/video.svg';
import { MenuLink } from './MenuLink';
import React from 'react';

export const LeftMenu = () => {
  const profileId = '123';

  const menuItems = [
    { href: '/', icon: HomeIcon, alt: 'Home', label: 'Главная' },
    {
      href: `/profile/${profileId}`,
      icon: ProfileIcon,
      alt: 'Profile',
      label: 'Профиль',
      hasDivider: true,
    },
    {
      href: '/editor/add-video',
      icon: AddIcon,
      alt: 'Add',
      label: 'Добавить видео',
    },
    {
      href: `/profile/${profileId}/videos`,
      icon: VideoIcon,
      alt: 'Videos',
      label: 'Ваши видео',
    },
  ];

  return (
    <aside className="h-full py-4">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <React.Fragment key={item.href + item.label}>
            <MenuLink href={item.href} icon={item.icon} alt={item.alt}>
              {item.label}
            </MenuLink>

            {item.hasDivider && <div className="my-2 h-px bg-zinc-800" />}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
};
