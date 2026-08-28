import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useFilters } from './hooks/useFilters';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateSummary } from './utils/calculations';

import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ExpenseForm } from './components/ExpenseForm';
import { FilterBar } from './components/FilterBar';
import { ExpenseTable } from './components/ExpenseTable';
import { CategoryChart } from './components/CategoryChart';

export function App() {
  const { expenses, editingExpense, lastTransactionType, dispatch } = useExpenses();
  const { filters, setFilter, clearFilters, filteredExpenses } = useFilters(expenses);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [isMonthlyView, setIsMonthlyView] = useState(false);

  // Sync data-theme attribute with document root & body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Compute summary values from all expenses using useMemo
  const summary = useMemo(() => {
    return calculateSummary(expenses);
  }, [expenses]);

  // Memoized event handlers passed as props
  const handleSaveExpense = useCallback(
    (expenseData, isEdit) => {
      if (isEdit) {
        dispatch({ type: 'UPDATE_EXPENSE', payload: expenseData });
      } else {
        dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
      }
    },
    [dispatch]
  );

  const handleEditExpense = useCallback(
    (expense) => {
      dispatch({ type: 'SET_EDITING', payload: expense });
    },
    [dispatch]
  );

  const handleDeleteExpense = useCallback(
    (id) => {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    },
    [dispatch]
  );

  const handleCancelEdit = useCallback(() => {
    dispatch({ type: 'CLEAR_EDITING' });
  }, [dispatch]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const handleToggleMonthlyView = useCallback(() => {
    setIsMonthlyView((prev) => !prev);
  }, []);

  return (
    <div className="app-root" data-theme={theme}>
      <div className="app-container">
        {/* Header Component */}
        <Header
          totalBalance={summary.netBalance}
          lastTransactionType={lastTransactionType}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* 3-Column Summary Cards */}
        <SummaryCards
          totalIncome={summary.totalIncome}
          totalExpenses={summary.totalExpenses}
          netBalance={summary.netBalance}
        />

        {/* 2-Column Main Dashboard Layout */}
        <main className="dashboard-grid">
          {/* Left Column: Form & Category Chart */}
          <div className="dashboard-column left-column">
            <ExpenseForm
              onSubmit={handleSaveExpense}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
            />
            <CategoryChart expenses={expenses} />
          </div>

          {/* Right Column: Filter Bar & Expense Table */}
          <div className="dashboard-column right-column">
            <FilterBar
              filters={filters}
              onFilterChange={setFilter}
              onClearFilters={clearFilters}
            />
            <ExpenseTable
              expenses={filteredExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              isMonthlyView={isMonthlyView}
              onToggleMonthlyView={handleToggleMonthlyView}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
