import Link from 'next/link';
import { CATEGORIES } from '@/shared/constants';

interface CategoriesTabsProps {
  activeTab?: string;
  basePath?: string;
  userId?: number;
  activeCategoriesKeys?: string[];
}

const BASE_TAB_CLASS =
  'cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors';
const ACTIVE_TAB_CLASS = 'bg-zinc-100 text-black';
const INACTIVE_TAB_CLASS = 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800';

export const CategoriesTabs = ({
  activeTab,
  basePath = '',
  activeCategoriesKeys,
}: CategoriesTabsProps) => {

  const isAllActive = activeTab === 'all' || !activeTab;

  return (
    <div className="mb-6 flex flex-wrap gap-2 px-2 pt-4">
      <Link
        href={basePath || '/'}
        className={`${BASE_TAB_CLASS} ${isAllActive ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
      >
        Все
      </Link>

      {activeCategoriesKeys?.map((categoryKey) => {
        const foundCategory = CATEGORIES.find(
          (item) => item.value === categoryKey,
        );

        if (!foundCategory) return null;
        const displayLabel = foundCategory.label;
        const isCurrentActive = activeTab === categoryKey;

        return (
          <Link
            key={categoryKey}
            href={`${basePath}/category/${categoryKey}`}
            className={`${BASE_TAB_CLASS} ${isCurrentActive ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
          >
            {displayLabel}
          </Link>
        );
      })}
    </div>
  );
};
