import Image from 'next/image';
import Link from 'next/link';
import { MenuLink } from './MenuLink';
import HomeIcon from '@/shared/assets/icons/home.svg';
import ProfileIcon from '@/shared/assets/icons/profile.svg';
import AddIcon from '@/shared/assets/icons/add.svg';
import VideoIcon from '@/shared/assets/icons/video.svg';
import { useSidebar } from '../SidebarContext';
import Logo from '../Header/logo.png';

export const LeftMenu = () => {
  const profileId = '123';

  const { toggleSidebar, closeSidebar } = useSidebar();

  const menuItems = [
    { href: '/', icon: HomeIcon, alt: 'Home', label: 'Главная' },
    {
      href: `/profile/${profileId}`,
      icon: ProfileIcon,
      alt: 'Profile',
      label: 'Профиль',
    },
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
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label="Закрыть меню"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M21 6H3V5h18v11zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
          </svg>
        </button>
        <Link href="/" className="flex items-center">
          <Image src={Logo} alt="Logo" width={40} height={27.5} />
        </Link>
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
