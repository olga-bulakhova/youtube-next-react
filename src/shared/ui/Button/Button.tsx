import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'base' | 'danger' | 'emerald' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
}

export const Button = ({
  children,
  isLoading = false,
  loadingText,
  icon,
  variant = 'base',
  className = '',
  disabled,
  href,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:border-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-600';

  const variantStyles = {
    base: 'border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white',
    danger:
      'border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-300 hover:border-red-500 hover:bg-red-600 hover:text-white',
    emerald:
      'border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-300 hover:border-transparent hover:bg-emerald-500',

    // 🌟 НОВОЕ: Вариант 'success' со сплошным стабильным зеленым фоном, темным текстом и мягкой тенью
    success:
      'border-transparent bg-emerald-500 px-5 py-2.5 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 ',
  };

  const finalClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-white" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && (
            <span className="flex items-center justify-center">{icon}</span>
          )}
          <span>{children}</span>
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={finalClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={finalClassName}
      {...props}
    >
      {content}
    </button>
  );
};
