import React from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../hooks/useExpenses';

export function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  categories
}) {
  const categoryOptions = categories || ['All', ...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  const isFilterActive =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <div className="card-container filter-bar">
      <div className="filter-header">
        <div className="filter-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <h3>Filter Records</h3>
        </div>

        {isFilterActive && (
          <button
            type="button"
            className="btn btn-text clear-btn"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="filter-controls-flex">
        {/* Search Input */}
        <div className="filter-group search-group">
          <label htmlFor="filter-search">Search</label>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="filter-search"
              type="text"
              placeholder="Search description or category..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="filter-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="filter-group">
          <label htmlFor="filter-date-from">From Date</label>
          <input
            id="filter-date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="filter-group">
          <label htmlFor="filter-date-to">To Date</label>
          <input
            id="filter-date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
