import React from 'react';

export function EmptyState({ isFiltered, onClearFilters }) {
  return (
    <div className="empty-state-container" role="status">
      <div className="empty-state-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>
      <h3 className="empty-state-title">
        {isFiltered ? 'No matching transactions found' : 'No transactions recorded yet'}
      </h3>
      <p className="empty-state-description">
        {isFiltered
          ? 'Try adjusting your search criteria or clearing active filters.'
          : 'Start tracking your financial progress by adding a new income or expense above.'}
      </p>
      {isFiltered && onClearFilters && (
        <button type="button" className="btn btn-outline" onClick={onClearFilters}>
          Reset All Filters
        </button>
      )}
    </div>
  );
}
