import React, { useState } from 'react';

const ExpenseForm = ({ categories, onAddExpense }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({ category, amount });
    setCategory('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat.category}>{cat.category}</option>
        ))}
      </select>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
