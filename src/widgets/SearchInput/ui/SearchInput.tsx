'use client';

import Link from 'next/link';
import { APP_ROUTES } from '@/shared/constants';
import { useLiveSearch } from '../model/useLiveSearch';
import { SearchIcon } from '@/shared/icons/SearchIcon';

export const SearchInput = () => {
  const {
    query,
    setQuery,
    visibleResults,
    totalCount,
    hasMoreThanTen,
    isOpen,
    isLoading,
    wrapperRef,
    openDropdown,
    closeDropdown,
    handleSearchSubmit,
  } = useLiveSearch();

  return (
    <div
      ref={wrapperRef}
      className="relative min-w-full select-none md:w-[400px] md:min-w-auto"
    >
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={query}
          onFocus={openDropdown}
          onChange={(e) => {
            setQuery(e.target.value);
            openDropdown();
          }}
          placeholder="Поиск по названию..."
          className="h-9 w-full rounded-full border border-zinc-800 bg-zinc-900/50 px-4 pr-10 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-700 focus:bg-zinc-900 focus:outline-none"
        />

        <button
          type="submit"
          className="absolute right-3 flex h-6 w-6 cursor-pointer items-center justify-center text-zinc-500 transition-colors hover:text-zinc-200 focus:outline-none"
          aria-label="Искать"
        >
          {isLoading ? (
            <span className="h-3 w-3 animate-spin rounded-full border border-zinc-500 border-t-white" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </button>
      </form>

      {isOpen && query.trim() && (visibleResults.length > 0 || isLoading) && (
        <div className="absolute top-11 left-0 z-50 w-full animate-fade-in overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl">
          {isLoading && visibleResults.length === 0 ? (
            <div className="py-4 text-center text-xs text-zinc-500">
              Ищем видео...
            </div>
          ) : (
            <div className="flex flex-col">
              {visibleResults.map((video) => (
                <Link
                  key={video.videoId}
                  href={APP_ROUTES.VIDEO(video.videoId)}
                  onClick={closeDropdown}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-zinc-900"
                >
                  <SearchIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="truncate text-sm font-medium text-zinc-200 hover:text-white">
                    {video.title}
                  </span>
                </Link>
              ))}

              {hasMoreThanTen && (
                <Link
                  href={APP_ROUTES.SEARCH(query)}
                  onClick={closeDropdown}
                  className="mt-1 border-t border-zinc-900 pt-2 pb-1 text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
                >
                  Показать все результаты ({totalCount}) →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
