import React, { useState } from 'react';

const BudgetCategoryForm = ({ onAddCategory }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCategory({ category, limit: parseFloat(limit), spent: 0 });
    setCategory('');
    setLimit('');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
      <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Budget Limit" required />
      <button type="submit">Add</button>
    </form>
  );
};

export default BudgetCategoryForm;
