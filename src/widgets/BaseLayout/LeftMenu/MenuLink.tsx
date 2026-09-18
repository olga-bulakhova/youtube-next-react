'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type MenuLinkProps = {
  href: string;
  icon: string;
  alt: string;
  children: React.ReactNode;
};

export const MenuLink = ({ href, icon, alt, children }: MenuLinkProps) => {
  const pathname = usePathname();

  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Image
        src={icon}
        alt={alt}
        width={20}
        height={20}
        className={
          isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
        }
        aria-hidden="true"
      />
      <span>{children}</span>
    </Link>
  );
};
