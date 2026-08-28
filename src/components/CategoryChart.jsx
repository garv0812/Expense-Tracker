import React, { memo, useMemo, useState, useEffect } from 'react';
import { calculateCategoryTotals } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

export const CategoryChart = memo(function CategoryChart({ expenses }) {
  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(expenses);
  }, [expenses]);

  const [animatedWidths, setAnimatedWidths] = useState({});

  useEffect(() => {
    // Trigger smooth bar width animation when category totals update
    const timer = setTimeout(() => {
      const newWidths = {};
      Object.keys(categoryTotals).forEach((cat) => {
        newWidths[cat] = categoryTotals[cat].percentage;
      });
      setAnimatedWidths(newWidths);
    }, 50);

    return () => clearTimeout(timer);
  }, [categoryTotals]);

  const categories = Object.keys(categoryTotals);

  return (
    <div className="card-container chart-card">
      <div className="chart-header">
        <h2>Expense Breakdown</h2>
        <span className="chart-subtitle">By Category</span>
      </div>

      {categories.length === 0 ? (
        <div className="chart-empty">
          <p>No expense data available for visualization.</p>
        </div>
      ) : (
        <div className="chart-bars-list">
          {categories.map((cat) => {
            const { total, percentage } = categoryTotals[cat];
            const barWidth = animatedWidths[cat] !== undefined ? animatedWidths[cat] : 0;

            return (
              <div key={cat} className="chart-bar-item">
                <div className="chart-bar-info">
                  <span className="category-badge" data-category={cat}>
                    {cat}
                  </span>
                  <div className="chart-bar-values">
                    <span className="chart-amount">{formatCurrency(total)}</span>
                    <span className="chart-percent">{percentage}%</span>
                  </div>
                </div>

                <div className="chart-progress-track">
                  <div
                    className="chart-progress-fill"
                    data-category={cat}
                    style={{ width: `${barWidth}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`${cat} expense percentage`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
