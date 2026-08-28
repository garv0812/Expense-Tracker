import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, deriveTransactionType } from '../hooks/useExpenses';

const getTodayDateString = () => {
  return new Date().toISOString().slice(0, 10);
};

export function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayDateString());

  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingExpense);

  // Sync form fields when editingExpense prop changes
  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description || '');
      setAmount(editingExpense.amount !== undefined ? String(editingExpense.amount) : '');
      setCategory(editingExpense.category || 'Food');
      setDate(editingExpense.date || getTodayDateString());
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('Food');
    setDate(getTodayDateString());
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    }

    if (!category) {
      newErrors.category = 'Category is required.';
    }

    if (!date) {
      newErrors.date = 'Date is required.';
    } else {
      const todayStr = getTodayDateString();
      if (date > todayStr) {
        newErrors.date = 'Date cannot be in the future.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const derivedType = deriveTransactionType(category);

    const payload = {
      description: description.trim(),
      amount: Number(amount),
      category,
      type: derivedType,
      date
    };

    if (editingExpense) {
      payload.id = editingExpense.id;
    } else {
      payload.id = Date.now();
    }

    onSubmit(payload, isEditing);

    if (!editingExpense) {
      resetForm();
    }
  };

  const derivedType = deriveTransactionType(category);

  return (
    <div className="card-container form-card">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
        <span className={`transaction-type-badge ${derivedType}`}>
          Type: {derivedType.toUpperCase()}
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="expense-form">
        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            className={errors.description ? 'input-error' : ''}
            placeholder="e.g. Lunch, Salary, Electricity Bill"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <span className="error-message" role="alert">
              {errors.description}
            </span>
          )}
        </div>

        {/* Amount Field */}
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            className={errors.amount ? 'input-error' : ''}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && (
            <span className="error-message" role="alert">
              {errors.amount}
            </span>
          )}
        </div>

        {/* Category Select with optgroups */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className={errors.category ? 'input-error' : ''}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <optgroup label="Income">
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </optgroup>
            <optgroup label="Expense">
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.category && (
            <span className="error-message" role="alert">
              {errors.category}
            </span>
          )}
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            max={getTodayDateString()}
            className={errors.date ? 'input-error' : ''}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && (
            <span className="error-message" role="alert">
              {errors.date}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onCancelEdit();
                resetForm();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
