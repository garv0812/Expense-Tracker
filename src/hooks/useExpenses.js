import { useReducer, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other Income'];
export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

export const deriveTransactionType = (category) => {
  if (INCOME_CATEGORIES.includes(category)) {
    return 'income';
  }
  return 'expense';
};

const INITIAL_EXPENSES = [];


function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newType = action.payload.type || deriveTransactionType(action.payload.category);
      const newExpense = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        amount: Number(action.payload.amount),
        type: newType
      };
      return {
        ...state,
        expenses: [newExpense, ...state.expenses],
        lastTransactionType: newType
      };
    }
    case 'UPDATE_EXPENSE': {
      const updatedType = action.payload.type || deriveTransactionType(action.payload.category);
      const updatedExpense = {
        ...action.payload,
        amount: Number(action.payload.amount),
        type: updatedType
      };
      return {
        ...state,
        expenses: state.expenses.map((item) =>
          item.id === updatedExpense.id ? updatedExpense : item
        ),
        editingExpense: null,
        lastTransactionType: updatedType
      };
    }
    case 'DELETE_EXPENSE': {
      return {
        ...state,
        expenses: state.expenses.filter((item) => item.id !== action.payload)
      };
    }
    case 'SET_EDITING': {
      return {
        ...state,
        editingExpense: action.payload
      };
    }
    case 'CLEAR_EDITING': {
      return {
        ...state,
        editingExpense: null
      };
    }
    default:
      return state;
  }
}

export function useExpenses() {
  const [persistedExpenses, setPersistedExpenses] = useLocalStorage('expenses', INITIAL_EXPENSES);

  const [state, dispatch] = useReducer(expensesReducer, {
    expenses: persistedExpenses,
    editingExpense: null,
    lastTransactionType: null
  });

  // Sync state.expenses changes to localStorage
  useEffect(() => {
    setPersistedExpenses(state.expenses);
  }, [state.expenses, setPersistedExpenses]);

  return {
    expenses: state.expenses,
    editingExpense: state.editingExpense,
    lastTransactionType: state.lastTransactionType,
    dispatch
  };
}
