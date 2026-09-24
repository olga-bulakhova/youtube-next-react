import React from 'react';
import Link from 'next/link';

interface UserMenuItemProps {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
}

export const UserMenuItem = ({
  children,
  icon: Icon,
  onClick,
  href,
}: UserMenuItemProps) => {
  const commonClassName =
    'group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10 hover:text-white focus:outline-none';

  const iconElement = (
    <Icon className="h-5 w-5 opacity-60 transition-opacity duration-200 group-hover:opacity-100" />
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={commonClassName}>
        {iconElement}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={commonClassName}>
      {iconElement}
      <span>{children}</span>
    </button>
  );
};
