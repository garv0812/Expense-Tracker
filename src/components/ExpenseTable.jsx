import React, { memo, useMemo } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { EmptyState } from './EmptyState';

export const ExpenseTable = memo(function ExpenseTable({
  expenses = [],
  onEdit,
  onDelete,
  isMonthlyView = false,
  onToggleMonthlyView
}) {
  // Compute sums for currently visible rows only
  const visibleTotals = useMemo(() => {
    return expenses.reduce(
      (acc, item) => {
        const val = Number(item.amount) || 0;
        if (item.type === 'income') {
          acc.totalIncome += val;
        } else {
          acc.totalExpenses += val;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );
  }, [expenses]);

  const visibleNet = visibleTotals.totalIncome - visibleTotals.totalExpenses;

  // Bonus ⭐: Monthly view grouping calculation
  const monthlyData = useMemo(() => {
    if (!isMonthlyView) return [];

    const monthsMap = {};
    expenses.forEach((item) => {
      if (!item.date) return;
      const monthKey = item.date.slice(0, 7); // YYYY-MM
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { monthKey, income: 0, expense: 0, count: 0 };
      }
      const val = Number(item.amount) || 0;
      if (item.type === 'income') {
        monthsMap[monthKey].income += val;
      } else {
        monthsMap[monthKey].expense += val;
      }
      monthsMap[monthKey].count += 1;
    });

    return Object.values(monthsMap).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [expenses, isMonthlyView]);

  const handleDelete = (id, description) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${description || 'this transaction'}"?`
    );
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <div className="card-container table-card">
      <div className="table-header">
        <div className="table-header-titles">
          <h2>{isMonthlyView ? 'Monthly Expense Summary' : 'Transactions History'}</h2>
          <span className="row-count-badge">
            {isMonthlyView
              ? `${monthlyData.length} Month${monthlyData.length === 1 ? '' : 's'}`
              : `${expenses.length} Transaction${expenses.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {onToggleMonthlyView && (
          <button
            type="button"
            className="btn btn-secondary view-toggle-btn"
            onClick={onToggleMonthlyView}
          >
            {isMonthlyView ? '📋 Show Detailed List' : '📅 Monthly Summary View'}
          </button>
        )}
      </div>

      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            {isMonthlyView ? (
              <tr>
                <th>Month</th>
                <th>Total Income</th>
                <th>Total Expense</th>
                <th className="text-right">Net Savings</th>
                <th className="text-center">Count</th>
              </tr>
            ) : (
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            )}
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState message="No expenses found matching the current filters." />
                </td>
              </tr>
            ) : isMonthlyView ? (
              monthlyData.map((row) => {
                const net = row.income - row.expense;
                return (
                  <tr key={row.monthKey} data-type={net >= 0 ? 'income' : 'expense'}>
                    <td className="desc-cell">{row.monthKey}</td>
                    <td className="amount-cell positive">{formatCurrency(row.income)}</td>
                    <td className="amount-cell negative">{formatCurrency(row.expense)}</td>
                    <td className="amount-cell text-right">
                      <span className={`amount-value ${net >= 0 ? 'income' : 'expense'}`}>
                        {formatCurrency(net)}
                      </span>
                    </td>
                    <td className="text-center">{row.count} items</td>
                  </tr>
                );
              })
            ) : (
              expenses.map((item) => (
                <tr key={item.id} data-type={item.type}>
                  <td className="date-cell">{formatDate(item.date)}</td>
                  <td className="desc-cell">{item.description}</td>
                  <td>
                    <span className="category-badge" data-category={item.category}>
                      {item.category}
                    </span>
                  </td>
                  <td className="amount-cell text-right">
                    <span className={`amount-value ${item.type}`}>
                      {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                    </span>
                  </td>
                  <td className="actions-cell text-center">
                    <button
                      type="button"
                      className="btn-icon edit-icon-btn"
                      onClick={() => onEdit(item)}
                      title="Edit Expense"
                      aria-label={`Edit ${item.description}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-icon delete-icon-btn"
                      onClick={() => handleDelete(item.id, item.description)}
                      title="Delete Expense"
                      aria-label={`Delete ${item.description}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {expenses.length > 0 && (
            <tfoot>
              <tr className="tfoot-row">
                <td colSpan="3" className="tfoot-label">
                  Filtered Visible Totals
                </td>
                <td colSpan="2" className="tfoot-amounts">
                  <div className="tfoot-summary-group">
                    <span className="summary-item positive">
                      Income: <strong>{formatCurrency(visibleTotals.totalIncome)}</strong>
                    </span>
                    <span className="summary-item negative">
                      Expenses: <strong>{formatCurrency(visibleTotals.totalExpenses)}</strong>
                    </span>
                    <span className={`summary-item net ${visibleNet >= 0 ? 'positive' : 'negative'}`}>
                      Net: <strong>{formatCurrency(visibleNet)}</strong>
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
});
