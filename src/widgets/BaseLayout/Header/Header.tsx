'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from './logo.png';
import { useSidebar } from '../SidebarContext';

type HeaderProps = {
  profileId: string;
};

export const Header = ({ profileId }: HeaderProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label="Главное меню"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M21 6H3V5h18v11zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
          </svg>
        </button>

        <Link href="/" className="flex items-center">
          <Image src={Logo} alt="Logo" width={40} height={27.5} />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/editor/add-video"
          className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
        >
          <span className="mb-1 text-2xl leading-none font-light">+</span>
          <span>Добавить</span>
        </Link>
      </div>
    </header>
  );
};
