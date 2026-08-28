import React, { useMemo, useCallback, useEffect } from 'react';
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
  const { filters, setFilter, clearFilters, filteredExpenses, isFiltered } = useFilters(expenses);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // Sync data-theme attribute with document element and body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);


  // Compute summary values from all expenses
  const summary = useMemo(() => {
    return calculateSummary(expenses);
  }, [expenses]);

  // Memoized event handlers to prevent unnecessary re-renders of memoized children
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

  return (
    <div className="app-root" data-theme={theme}>
      <div className="app-container">
        {/* Header */}
        <Header
          netBalance={summary.netBalance}
          lastTransactionType={lastTransactionType}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* 3-Column Summary Cards */}
        <SummaryCards summary={summary} />

        {/* 2-Column Main Dashboard Layout */}
        <main className="dashboard-grid">
          {/* Left Column: Form & Category Chart */}
          <div className="dashboard-column left-column">
            <ExpenseForm
              editingExpense={editingExpense}
              onSave={handleSaveExpense}
              onCancel={handleCancelEdit}
            />
            <CategoryChart expenses={expenses} />
          </div>

          {/* Right Column: Filter Bar & Table */}
          <div className="dashboard-column right-column">
            <FilterBar
              filters={filters}
              isFiltered={isFiltered}
              onFilterChange={setFilter}
              onClearFilters={clearFilters}
            />
            <ExpenseTable
              expenses={filteredExpenses}
              isFiltered={isFiltered}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onClearFilters={clearFilters}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
