import React, { useState } from 'react';

const BudgetForm = ({ onAdd }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    onAdd({ category, amount: Number(amount) });
    setCategory('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Budget Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add Budget</button>
    </form>
  );
};

export default BudgetForm;
