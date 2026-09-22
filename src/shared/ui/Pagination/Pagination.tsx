'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/icons';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination = ({ totalItems, itemsPerPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    router.push(`?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const leftBound = Math.max(2, currentPage - 2);
    const rightBound = Math.min(totalPages - 1, currentPage + 2);

    if (leftBound > 2) {
      pages.push('...');
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    if (rightBound < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  };

  const visiblePages = getVisiblePages();

  const baseBtnClass =
    'flex h-7 w-7 items-center cursor-pointer justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:outline-none disabled:opacity-30 disabled:pointer-events-none';

  return (
    <div className="mt-8 flex items-center justify-center gap-3 py-4 select-none">
      <button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`${baseBtnClass} text-zinc-400 hover:bg-white/10 hover:text-white`}
        aria-label="Предыдущая страница"
      >
        <ChevronLeftIcon className="h-5 w-5 fill-current" />
      </button>

      {/* Цифры страниц */}
      <div className="flex items-center gap-2">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-7 w-7 items-center justify-center text-sm text-zinc-500"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              onClick={() => handlePageChange(page as number)}
              className={`${baseBtnClass} ${
                isCurrent
                  ? 'border border-zinc-800 bg-zinc-900 font-semibold text-zinc-100'
                  : 'active: border-zinc-800 text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`${baseBtnClass} text-zinc-400 hover:bg-white/10 hover:text-white`}
        aria-label="Следующая страница"
      >
        <ChevronRightIcon className="h-5 w-5 fill-current" />
      </button>
    </div>
  );
};
