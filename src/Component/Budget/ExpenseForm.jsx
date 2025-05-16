import React, { useState } from 'react';

const ExpenseForm = ({ onAddExpense, budgets }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    onAddExpense(category, amount);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {budgets.map((b, i) => (
          <option key={i} value={b.category}>{b.category}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Expense Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
