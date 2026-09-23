import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ROUTES } from '@/shared/constants';
import { IVideoItem } from '@/app/api/videos/_storage/types';

export const useLiveSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [results, setResults] = useState<IVideoItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 1. Дебаунс для запросов к API живого поиска
  useEffect(() => {
    // Создаем таймер дебаунса
    const delayDebounceFn = setTimeout(async () => {
      // ИЗМЕНЕНИЕ: Если строка пустая, очищаем стейт внутри таймера (асинхронно)
      const trimmedQuery = query.trim();

      // 🌟 ИСПРАВЛЕНО: Если ввели 2 символа или меньше (либо просто пробелы) —
      // моментально очищаем результаты СИНХРОННО, не дожидаясь таймера дебаунса.
      // Это исключает лишнее мигание лоадера на клиенте.
      if (trimmedQuery.length <= 0) {
        setResults([]);
        setTotalCount(0);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_ROUTES.VIDEOS.SEARCH}?q=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const responseData = await res.json();
          const data = responseData.data || responseData;
          setResults(data.videos || []);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Ошибка при живом поиске роликов:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Задержка 300 мс

    // Очищаем таймер, если пользователь продолжает вводить буквы
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // 2. Закрытие выпадающего списка при клике мимо инпута
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
    if (!query.trim()) return;
    setIsOpen(false);

    // Перенаправляем на главную страницу с query-параметрами поиска
    router.push(`/?search=${encodeURIComponent(query.trim())}&page=1`);
  };

  const closeDropdown = () => setIsOpen(false);
  const openDropdown = () => setIsOpen(true);

  // Ограничиваем выдачу первыми 10 элементами
  const visibleResults = results.slice(0, 10);
  const hasMoreThanTen = totalCount > 10;

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
