import React, { useState, useEffect } from "react";
import { db } from "../../LoginPage/firebase";
import { useUser } from "../../context/UserContext";
import BudgetChart from "./BudgetChart";
import "./BudgetPage.css";
import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const BudgetPage = () => {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState("");
  const [spent, setSpent] = useState("");
  const [month, setMonth] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // New: error states
  const [errors, setErrors] = useState({});

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const defaultBudgets = [
    { category: "Food", total: 5000, spent: 2500, month: "January" },
    { category: "Travel", total: 10000, spent: 18000, month: "February" },
    { category: "Shopping", total: 3000, spent: 3000, month: "March" }
  ];

  const fetchBudgets = async () => {
    try {
      if (!user || !user.uid) {
        setBudgets(defaultBudgets.map((item, idx) => ({ ...item, id: idx.toString() })));
        setIsDemoMode(true);
        return;
      }
      setIsDemoMode(false);
      const budgetsRef = collection(db, "users", user.uid, "budgets");
      const snapshot = await getDocs(budgetsRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const clearForm = () => {
    setCategory(""); setTotal(""); setSpent(""); setMonth(""); setEditId(null);
    setErrors({});
  };

  const handleAddOrUpdate = async () => {
    // validate fields
    let newErrors = {};
    if (!category.trim()) newErrors.category = "Category is required";
    if (!total.trim()) newErrors.total = "Total budget is required";
    if (!spent.trim()) newErrors.spent = "Spent amount is required";
    if (!month.trim()) newErrors.month = "Please select a month";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newBudget = {
      category,
      total: parseFloat(total),
      spent: parseFloat(spent),
      month,
    };

    if (isDemoMode) {
      setBudgets((prev) =>
        editId ? prev.map((b) => b.id === editId ? { ...newBudget, id: editId } : b)
              : [...prev, { ...newBudget, id: Date.now().toString() }]
      );
      clearForm();
    } else {
      try {
        const budgetsRef = collection(db, "users", user.uid, "budgets");
        if (editId) {
          await updateDoc(doc(budgetsRef, editId), newBudget);
        } else {
          await addDoc(budgetsRef, newBudget);
        }
        await fetchBudgets();
        clearForm();
      } catch (err) {
        console.error("Error saving budget:", err);
      }
    }
  };

  const handleEdit = (item) => {
    setCategory(item.category);
    setTotal(item.total.toString());
    setSpent(item.spent.toString());
    setMonth(item.month);
    setEditId(item.id);
    setErrors({});
  };

  const handleDelete = async () => {
    if (!editId) return;
    if (isDemoMode) {
      setBudgets((prev) => prev.filter((b) => b.id !== editId));
    } else {
      try {
        await deleteDoc(doc(db, "users", user.uid, "budgets", editId));
        await fetchBudgets();
      } catch (err) {
        console.error("Error deleting budget:", err);
      }
    }
    clearForm();
  };

  const handleClearAll = async () => {
    if (isDemoMode) {
      setBudgets([]);
    } else {
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "budgets"));
        const deletePromises = snapshot.docs.map((docSnap) =>
          deleteDoc(doc(db, "users", user.uid, "budgets", docSnap.id))
        );
        await Promise.all(deletePromises);
        setBudgets([]);
      } catch (err) {
        console.error("Error clearing all budgets:", err);
      }
    }
  };

  const filteredBudgets = selectedMonth
    ? budgets.filter((item) => item.month === selectedMonth)
    : budgets;

  return (
    <div className="budget-container">
      <h2>Budget Planner</h2>
      {isDemoMode && (
        <div className="demo-banner">🧪 Demo mode: changes won’t be saved after refresh.</div>
      )}

      <div className="month-filter">
        <label>Filter by Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="budget-form">
        <div className="input-group">
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          {errors.category && <span className="input-error">{errors.category}</span>}
        </div>
        <div className="input-group">
          <input type="number" placeholder="Total Budget" value={total} onChange={(e) => setTotal(e.target.value)} />
          {errors.total && <span className="input-error">{errors.total}</span>}
        </div>
        <div className="input-group">
          <input type="number" placeholder="Already Spent" value={spent} onChange={(e) => setSpent(e.target.value)} />
          {errors.spent && <span className="input-error">{errors.spent}</span>}
        </div>
        <div className="input-group">
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.month && <span className="input-error">{errors.month}</span>}
        </div>

        <button onClick={handleAddOrUpdate}>{editId ? "Update" : "Add Budget"}</button>
        {editId && (
          <button onClick={handleDelete} style={{ backgroundColor: "#fc6a03", color: "white" }}>
            Delete Selected
          </button>
        )}
        <button onClick={handleClearAll} style={{ backgroundColor: "#D30000", color: "white" }}>
          Clear All Budgets
        </button>
      </div>

      <div className="chart-section">
        <BudgetChart data={filteredBudgets} />
      </div>

      <div className="budget-list">
        {filteredBudgets.length === 0 ? (
          <div className="empty-message fade-in">
            <span className="empty-icon">📝</span>
            <p>{isDemoMode
              ? "No demo data to display."
              : "➕ Add your budget data to get started!"}</p>
          </div>
        ) : (
          filteredBudgets.map((item) => {
            const remaining = item.total - item.spent;
            return (
              <div key={item.id} className={`budget-card ${
                remaining === 0 ? "yellow" : remaining < 0 ? "red" : "green"}`}
                onClick={() => handleEdit(item)}
              >
                <h3>{item.category}</h3>
                <p><strong>Month:</strong> {item.month}</p>
                <p><strong>Budget:</strong> ₹{item.total}</p>
                <p><strong>Spent:</strong> ₹{item.spent}</p>
                <p><strong>Remaining:</strong> ₹{remaining}</p>
                {remaining < 0 && <p className="warning-text">🚨 Over Budget by ₹{Math.abs(remaining)}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetPage;









