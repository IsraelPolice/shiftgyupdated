import React from 'react';
import { X } from 'lucide-react';

interface FilterPillsProps {
  filters: string[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onClearAll: () => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll
}) => {
  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Filter Templates</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All ({activeFilters.length})
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => {
          const isActive = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm border border-gray-300'
                }
              `}
            >
              {filter}
              {isActive && (
                <span className="ml-1 text-xs">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPills;