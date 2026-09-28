import React from 'react';
import { MarketCategory } from '../types/market';

interface CategoryFilterProps {
  categories: MarketCategory[];
  activeCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mt-4 flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-sm font-semibold select-none border-b border-gray-100 dark:border-[#2a2e39] pb-3">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722] shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2e39]'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
