'use client';

import Link from 'next/link';
import { APP_ROUTES } from '@/shared/constants';
import { useLiveSearch } from '../model/useLiveSearch';

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
            <svg
              xmlns="http://w3.org"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z"
              />
            </svg>
          )}
        </button>
      </form>

      {/* 🥞 ВСПЛЫВАЮЩИЙ ДРОПДАУН С РЕЗУЛЬТАТАМИ ПОД КНОПКОЙ */}
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
                  <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-3.5 w-3.5 shrink-0 text-zinc-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z"
                    />
                  </svg>
                  <span className="truncate text-sm font-medium text-zinc-200 hover:text-white">
                    {video.title}
                  </span>
                </Link>
              ))}

              {/* 🔗 ССЫЛКА НА ПОЛНЫЕ РЕЗУЛЬТАТЫ ПОИСКА (> 10) */}
              {hasMoreThanTen && (
                <Link
                  href={`/?search=${encodeURIComponent(query.trim())}&page=1`}
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
