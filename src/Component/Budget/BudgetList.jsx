import React from 'react';

const BudgetList = ({ categories }) => {
  return (
    <div className="budget-list">
      <h3>Budget Summary</h3>
      {categories.map((cat, i) => (
        <div key={i} className={`category-box ${cat.spent > cat.limit ? 'over-budget' : ''}`}>
          <strong>{cat.category}</strong><br />
          Spent: ₹{cat.spent} / ₹{cat.limit}
        </div>
      ))}
    </div>
  );
};

export default BudgetList;
