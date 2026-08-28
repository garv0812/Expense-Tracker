import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, deriveTransactionType } from '../hooks/useExpenses';

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export function ExpenseForm({ editingExpense, onSave, onCancel }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayString());

  const [errors, setErrors] = useState({});

  // Sync state when editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description || '');
      setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
      setCategory(editingExpense.category || 'Food');
      setDate(editingExpense.date || getTodayString());
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('Food');
    setDate(getTodayString());
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number greater than 0.';
    }

    if (!category) {
      newErrors.category = 'Category is required.';
    }

    if (!date) {
      newErrors.date = 'Date is required.';
    } else {
      const todayStr = getTodayString();
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
    }

    onSave(payload, Boolean(editingExpense));

    if (!editingExpense) {
      resetForm();
    }
  };

  const derivedType = deriveTransactionType(category);

  return (
    <div className="card-container form-card">
      <div className="form-header">
        <h2>{editingExpense ? 'Edit Transaction' : 'Add New Transaction'}</h2>
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
            placeholder="e.g. Client Payment, Groceries, Rent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="error-message" role="alert">
              {errors.description}
            </p>
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
            <p className="error-message" role="alert">
              {errors.amount}
            </p>
          )}
        </div>

        {/* Category Field */}
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
            <p className="error-message" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            max={getTodayString()}
            className={errors.date ? 'input-error' : ''}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && (
            <p className="error-message" role="alert">
              {errors.date}
            </p>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>

          {editingExpense && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onCancel();
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
