import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';

export function Header({ netBalance, lastTransactionType, theme, onToggleTheme }) {
  const [flashType, setFlashType] = useState(null);

  useEffect(() => {
    if (!lastTransactionType) return;

    setFlashType(lastTransactionType);
    const timer = setTimeout(() => {
      setFlashType(null);
    }, 600);

    return () => clearTimeout(timer);
  }, [lastTransactionType]);

  const balanceType = netBalance >= 0 ? 'income' : 'expense';

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="header-titles">
          <h1>Personal Expense Tracker</h1>
          <p className="header-subtitle">Smart Financial Analytics & Insights</p>
        </div>
      </div>

      <div className="header-actions">
        <div
          className={`net-balance-chip ${flashType ? `flash-${flashType}` : ''}`}
          data-type={flashType || balanceType}
          title="Current Net Balance"
        >
          <span className="balance-label">Net Balance</span>
          <span className="balance-amount">{formatCurrency(netBalance)}</span>
        </div>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
