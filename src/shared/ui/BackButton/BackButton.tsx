'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@/shared/icons';

interface BackButtonProps {
  className?: string;
  label?: string;
}

export const BackButton = ({
  className = '',
  label = 'Назад',
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`group flex w-fit cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white focus:outline-none ${className}`}
    >
      <ArrowLeftIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </button>
  );
};
