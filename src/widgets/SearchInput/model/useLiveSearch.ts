'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IVideoItem } from '@/app/api/videos/_storage/types';
import { videosApi } from '@/shared/api';
import { SEARCH, APP_ROUTES } from '@/shared/constants';

export const useLiveSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [results, setResults] = useState<IVideoItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSearchResults = async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < SEARCH.MIN_LENGTH) {
      setResults([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const responseData = await videosApi.search(trimmedQuery);

      setResults(responseData.videos || []);
      setTotalCount(responseData.total || 0);
    } catch (err) {
      console.error('Ошибка при живом поиске роликов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < SEARCH.MIN_LENGTH) return;
    setIsOpen(false);

    if (typeof APP_ROUTES.SEARCH === 'function') {
      router.push(APP_ROUTES.SEARCH(trimmedQuery));
    } else {
      router.push(`/search?search=${encodeURIComponent(trimmedQuery)}&page=1`);
    }
  };

  const closeDropdown = () => setIsOpen(false);
  const openDropdown = () => setIsOpen(true);
  const visibleResults = results.slice(0, SEARCH.SHOW_ALL_RESULTS);
  const hasMoreThanTen = totalCount > SEARCH.SHOW_ALL_RESULTS;

  return {
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
  };
};
