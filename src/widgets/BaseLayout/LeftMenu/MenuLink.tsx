'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuLinkProps = {
  href: string;
  // 1. ИСПРАВЛЕНО: Теперь icon принимает полноценный React-компонент, а не строку-путь
  icon: React.ComponentType<{ className?: string }>;
  alt?: string; // Становится опциональным, так как для инлайновых SVG alt не нужен (используется aria-hidden)
  children: React.ReactNode;
};

export const MenuLink = ({ href, icon: Icon, children }: MenuLinkProps) => {
  const pathname = usePathname();

  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      // Добавили класс "group", чтобы иконка могла реагировать на наведение на всю ссылку целиком
      className={`group flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {/* 2. ИСПРАВЛЕНО: Рендерим иконку как динамический компонент <Icon />.
          Управляем прозрачностью и цветом централизованно через Tailwind */}
      <Icon
        className={`h-5 w-5 transition-opacity duration-200 ${
          isActive
            ? 'text-white opacity-100'
            : 'text-zinc-400 opacity-60 group-hover:text-white group-hover:opacity-100'
        }`}
      />
      <span>{children}</span>
    </Link>
  );
};
