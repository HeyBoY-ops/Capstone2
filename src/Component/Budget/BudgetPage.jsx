import React, { useState } from 'react';
import BudgetCategoryForm from './BudgetCategoryForm';
import ExpenseForm from './ExpenseForm';
import BudgetChart from './BudgetChart';
import BudgetList from './BudgetList';
import './budget.css';

const BudgetPage = () => {
  const [categories, setCategories] = useState([]);

  const addCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const addExpense = ({ category, amount }) => {
    setCategories(categories.map(cat =>
      cat.category === category
        ? { ...cat, spent: cat.spent + parseFloat(amount) }
        : cat
    ));
  };

  return (
    <div className="budget-container">
      <h1>Budget Planner</h1>
      <BudgetCategoryForm onAddCategory={addCategory} />
      <ExpenseForm categories={categories} onAddExpense={addExpense} />
      <BudgetList categories={categories} />
      <BudgetChart data={categories} />
    </div>
  );
};

export default BudgetPage;
