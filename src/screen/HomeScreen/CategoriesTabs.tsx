import { CATEGORIES } from '../AddVideoScreen';

interface CategoriesTabsProps {
  categories: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CategoriesTabs = ({
  categories,
  activeTab,
  onTabChange,
}: CategoriesTabsProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2 px-2 pt-4">
      <button
        onClick={() => onTabChange('all')}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          activeTab === 'all'
            ? 'bg-zinc-100 text-black'
            : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
        }`}
      >
        Все
      </button>

      {categories.map((categoryKey) => {
        const foundCategory = CATEGORIES.find(
          (item) => item.value === categoryKey,
        );
        const displayLabel = foundCategory ? foundCategory.label : categoryKey;

        return (
          <button
            key={categoryKey}
            onClick={() => onTabChange(categoryKey)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === categoryKey
                ? 'bg-zinc-100 text-black'
                : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
};
