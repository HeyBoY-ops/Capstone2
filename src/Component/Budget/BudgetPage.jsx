import React, { useState, useEffect } from "react";
import "./BudgetPage.css";
import BudgetChart from "./BudgetChart";

const BudgetPage = () => {
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [spent, setSpent] = useState("");
  const [month, setMonth] = useState("");
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });
  const [editIndex, setEditIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const handleAddOrUpdate = () => {
    if (!category || !budget || !spent || !month) return;

    const newEntry = {
      category,
      budget: parseFloat(budget),
      spent: parseFloat(spent),
      month,
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
    setMonth("");
  };

  const handleEdit = (index) => {
    const item = budgets[index];
    setCategory(item.category);
    setBudget(item.budget);
    setSpent(item.spent);
    setMonth(item.month);
    setEditIndex(index);
  };

  const handleDelete = () => {
    if (editIndex !== null) {
      const updated = budgets.filter((_, i) => i !== editIndex);
      setBudgets(updated);
      setCategory("");
      setBudget("");
      setSpent("");
      setMonth("");
      setEditIndex(null);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const filteredBudgets = selectedMonth
    ? budgets.filter((item) => item.month === selectedMonth)
    : budgets;

  return (
    <div className="budget-container">
      <h2>Budget Planner</h2>

      {/* Month Filter */}
      <div className="month-filter">
        <label>Filter by Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Input Form */}
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
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button onClick={handleAddOrUpdate}>
          {editIndex !== null ? "Update" : "Add Budget"}
        </button>

        {editIndex !== null && (
          <button onClick={handleDelete} style={{ backgroundColor: "#f44336", color: "white" }}>
            Delete Selected
          </button>
        )}

        <button onClick={() => {
          localStorage.removeItem("budgets");
          setBudgets([]);
        }}>
          Clear All Budgets
        </button>
      </div>

      {/* Budget Cards */}
      <div className="budget-list">
        {filteredBudgets.map((item, index) => {
          const remaining = item.budget - item.spent;
          const overBudget = remaining < 0;

          return (
            <div
              key={index}
              className={`budget-card ${overBudget ? "over-budget" : ""}`}
              onClick={() => handleEdit(index)}
            >
              <h3>{item.category}</h3>
              <p><strong>Month:</strong> {item.month}</p>
              <p><strong>Budget:</strong> ₹{item.budget}</p>
              <p><strong>Spent:</strong> ₹{item.spent}</p>
              <p><strong>Remaining:</strong> ₹{remaining}</p>
              {overBudget && <p className="warning-text">⚠️ Over Budget!</p>}
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="chart-section">
        <BudgetChart data={filteredBudgets} />
      </div>
    </div>
  );
};

export default BudgetPage;
