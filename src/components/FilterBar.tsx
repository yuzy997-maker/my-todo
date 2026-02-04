import { FilterType } from '../types/todo';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: '全部' },
    { type: 'active', label: '未完成' },
    { type: 'completed', label: '已完成' },
  ];

  return (
    <div className="filter-section">
      {filters.map(({ type, label }) => (
        <button
          key={type}
          className={`filter-btn ${filter === type ? 'active' : ''}`}
          onClick={() => onFilterChange(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
