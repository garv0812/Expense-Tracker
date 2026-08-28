import React, { memo } from 'react';
import { formatCurrency } from '../utils/formatters';

export const SummaryCards = memo(function SummaryCards({ totalIncome = 0, totalExpenses = 0, netBalance = 0 }) {
  return (
    <section className="summary-grid" aria-label="Financial Summary">
      {/* Total Income Card */}
      <div className="summary-card income-card">
        <div className="card-header">
          <span className="card-title">Total Income</span>
          <div className="card-icon income-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-amount positive">{formatCurrency(totalIncome)}</h2>
          <span className="card-badge positive-badge">+ Earnings</span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="summary-card expense-card">
        <div className="card-header">
          <span className="card-title">Total Expenses</span>
          <div className="card-icon expense-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-amount negative">{formatCurrency(totalExpenses)}</h2>
          <span className="card-badge negative-badge">- Outgoings</span>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="summary-card net-card">
        <div className="card-header">
          <span className="card-title">Net Savings / Balance</span>
          <div className="card-icon net-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
        <div className="card-body">
          <h2 className={`card-amount ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netBalance)}
          </h2>
          <span className={`card-badge ${netBalance >= 0 ? 'positive-badge' : 'negative-badge'}`}>
            {netBalance >= 0 ? 'Positive Surplus' : 'Deficit Warning'}
          </span>
        </div>
      </div>
    </section>
  );
});
