import { useReducer, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other Income'];
export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

export const deriveTransactionType = (category) => {
  if (INCOME_CATEGORIES.includes(category)) {
    return 'income';
  }
  return 'expense';
};

const initialReducerState = {
  expenses: [],
  editingId: null,
  isEditing: false,
  lastTransactionType: null
};

function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const derivedType = action.payload.type || deriveTransactionType(action.payload.category);
      const newExpense = {
        ...action.payload,
        id: action.payload.id || Date.now(),
        amount: Number(action.payload.amount),
        type: derivedType
      };
      return {
        ...state,
        expenses: [newExpense, ...state.expenses],
        lastTransactionType: derivedType
      };
    }
    case 'UPDATE_EXPENSE': {
      const derivedType = action.payload.type || deriveTransactionType(action.payload.category);
      const updatedExpense = {
        ...action.payload,
        amount: Number(action.payload.amount),
        type: derivedType
      };
      return {
        ...state,
        expenses: state.expenses.map((item) =>
          item.id === updatedExpense.id ? updatedExpense : item
        ),
        editingId: null,
        isEditing: false,
        lastTransactionType: derivedType
      };
    }
    case 'DELETE_EXPENSE': {
      return {
        ...state,
        expenses: state.expenses.filter((item) => item.id !== action.payload),
        editingId: state.editingId === action.payload ? null : state.editingId,
        isEditing: state.editingId === action.payload ? false : state.isEditing
      };
    }
    case 'SET_EDITING': {
      // payload can be either an expense object or an ID
      const targetId = typeof action.payload === 'object' ? action.payload.id : action.payload;
      return {
        ...state,
        editingId: targetId,
        isEditing: true
      };
    }
    case 'CLEAR_EDITING': {
      return {
        ...state,
        editingId: null,
        isEditing: false
      };
    }
    default:
      return state;
  }
}

export function useExpenses() {
  const [persistedExpenses, setPersistedExpenses] = useLocalStorage('expenses', []);

  const [state, dispatch] = useReducer(expensesReducer, {
    ...initialReducerState,
    expenses: persistedExpenses
  });

  // Sync expenses changes to localStorage
  useEffect(() => {
    setPersistedExpenses(state.expenses);
  }, [state.expenses, setPersistedExpenses]);

  const editingExpense = useMemo(() => {
    if (!state.editingId) return null;
    return state.expenses.find((item) => item.id === state.editingId) || null;
  }, [state.expenses, state.editingId]);

  return {
    expenses: state.expenses,
    editingId: state.editingId,
    isEditing: state.isEditing,
    editingExpense,
    lastTransactionType: state.lastTransactionType,
    dispatch
  };
}
