import { useState, useMemo, useCallback } from 'react';

const initialFilters = {
  search: '',
  category: 'All',
  dateFrom: '',
  dateTo: ''
};

export function useFilters(expenses = []) {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Search filter (description or category)
      if (filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase().trim();
        const matchDesc = item.description ? item.description.toLowerCase().includes(searchTerm) : false;
        const matchCat = item.category ? item.category.toLowerCase().includes(searchTerm) : false;
        if (!matchDesc && !matchCat) return false;
      }

      // Category filter
      if (filters.category !== 'All') {
        if (item.category !== filters.category) return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        if (item.date < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        if (item.date > filters.dateTo) return false;
      }

      return true;
    });
  }, [expenses, filters]);

  return {
    filters,
    setFilter,
    clearFilters,
    filteredExpenses
  };
}
