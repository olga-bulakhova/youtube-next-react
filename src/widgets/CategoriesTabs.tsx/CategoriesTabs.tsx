import Link from 'next/link';
import { db } from '@/app/api/_utils/storage';
import { CATEGORIES } from '@/shared/constants';

interface CategoriesTabsProps {
  activeTab?: string;
}

const BASE_TAB_CLASS =
  'cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors';
const ACTIVE_TAB_CLASS = 'bg-zinc-100 text-black';
const INACTIVE_TAB_CLASS = 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800';

export const CategoriesTabs = ({ activeTab }: CategoriesTabsProps) => {
  const activeCategoriesKeys = db.getActiveCategories();
  const isAllActive = activeTab === 'all' || !activeTab;

  return (
    <div className="mb-6 flex flex-wrap gap-2 px-2 pt-4">
      <Link
        href="/"
        className={`${BASE_TAB_CLASS} ${isAllActive ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
      >
        Все
      </Link>

      {activeCategoriesKeys.map((categoryKey) => {
        const foundCategory = CATEGORIES.find(
          (item) => item.value === categoryKey,
        );

        if (!foundCategory) return null;
        const displayLabel = foundCategory.label;
        const isCurrentActive = activeTab === categoryKey;

        return (
          <Link
            key={categoryKey}
            href={`/category/${categoryKey}`}
            className={`${BASE_TAB_CLASS} ${isCurrentActive ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
          >
            {displayLabel}
          </Link>
        );
      })}
    </div>
  );
};
