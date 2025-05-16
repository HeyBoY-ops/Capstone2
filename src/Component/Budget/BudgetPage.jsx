import React, { useState, useEffect } from "react";
import "./BudgetPage.css";
import BudgetChart from "./BudgetChart";


const BudgetPage = () => {
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [spent, setSpent] = useState("");
  {/*const [budgets, setBudgets] = useState([]);*/ }
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);


  const handleAddOrUpdate = () => {
    if (!category || !budget || !spent) return;

    const newEntry = {
      category,
      budget: parseFloat(budget),
      spent: parseFloat(spent),
    };

    if (editIndex !== null) {
      const updated = [...budgets];
      updated[editIndex] = newEntry;
      setBudgets(updated);
      setEditIndex(null);
    } else {
      setBudgets([...budgets, newEntry]);
    }

    setCategory("");
    setBudget("");
    setSpent("");
  };

  const handleEdit = (index) => {
    const item = budgets[index];
    setCategory(item.category);
    setBudget(item.budget);
    setSpent(item.spent);
    setEditIndex(index);
  };

  return (
    <div className="budget-container">
      <h2>Budget Planner</h2>
      <div className="budget-form">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="number"
          placeholder="Already Spent"
          value={spent}
          onChange={(e) => setSpent(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editIndex !== null ? "Update" : "Add Budget"}
        </button>

        <button onClick={() => {
          localStorage.removeItem("budgets");
          setBudgets([]);
        }}>
          Clear All Budgets
        </button>

      </div>

      <div className="budget-list">
        {budgets.map((item, index) => {
          const remaining = item.budget - item.spent;
          const overBudget = remaining < 0;

          return (
            <div
              key={index}
              className={`budget-card ${overBudget ? "over-budget" : ""}`}
              onClick={() => handleEdit(index)}
            >
              <h3>{item.category}</h3>
              <p><strong>Budget:</strong> ₹{item.budget}</p>
              <p><strong>Spent:</strong> ₹{item.spent}</p>
              <p><strong>Remaining:</strong> ₹{remaining}</p>
              {overBudget && <p className="warning-text">⚠️ Over Budget!</p>}
            </div>
          );
        })}
      </div>

      <div className="chart-section">
        <BudgetChart data={budgets} />
      </div>
    </div>
  );
};

export default BudgetPage;
