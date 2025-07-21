import React, { useState, useEffect } from "react";
import { db } from "../../LoginPage/firebase";
import { useUser } from "../../context/UserContext";
import BudgetChart from "./BudgetChart";
import "./BudgetPage.css";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchBudgets = async () => {
    try {
      if (!user || !user.uid) return;
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "budgets")
      );
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const handleAddOrUpdate = async () => {
    try {
      if (!user || !user.uid || !category || !total || !spent || !month) return;

      const budgetsRef = collection(db, "users", user.uid, "budgets");
      const q = query(budgetsRef, where("category", "==", category), where("month", "==", month));
      const querySnapshot = await getDocs(q);

      const newBudget = {
        category,
        total: parseFloat(total),
        spent: parseFloat(spent),
        month,
      };

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, "users", user.uid, "budgets", docId);
        await updateDoc(docRef, newBudget);
        setEditId(null);
      } else {
        const newDocRef = doc(budgetsRef);
        await setDoc(newDocRef, newBudget);
      }

      fetchBudgets();
      setCategory("");
      setTotal("");
      setSpent("");
      setMonth("");
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  const handleEdit = (item) => {
    setCategory(item.category);
    setTotal(item.total);
    setSpent(item.spent);
    setMonth(item.month);
    setEditId(item.id);
  };

  const handleDelete = async () => {
    try {
      if (editId) {
        await deleteDoc(doc(db, "users", user.uid, "budgets", editId));
        fetchBudgets();
        setCategory("");
        setTotal("");
        setSpent("");
        setMonth("");
        setEditId(null);
      }
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "budgets"));
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "users", user.uid, "budgets", docSnap.id))
      );
      await Promise.all(deletePromises);
      setBudgets([]);
    } catch (err) {
      console.error("Error clearing all budgets:", err);
    }
  };

  const filteredBudgets = selectedMonth
    ? budgets.filter((item) => item.month === selectedMonth)
    : budgets;

  return (
    <div className="budget-container">
      <h2>Budget Planner</h2>

      <div className="month-filter">
        <label>Filter by Month: </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

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
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Already Spent"
          value={spent}
          onChange={(e) => setSpent(e.target.value)}
        />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button onClick={handleAddOrUpdate}>
          {editId ? "Update" : "Add Budget"}
        </button>

        {editId && (
          <button
            onClick={handleDelete}
            style={{ backgroundColor: "#fc6a03", color: "white" }}
          >
            Delete Selected
          </button>
        )}

        <button
          onClick={handleClearAll}
          style={{ backgroundColor: "#D30000", color: "white" }}
        >
          Clear All Budgets
        </button>
      </div>

      <div className="chart-section">
        <BudgetChart data={filteredBudgets} />
      </div>

      <div className="budget-list">
        {filteredBudgets.map((item) => {
          const remaining = item.total - item.spent;
          const overBudget = remaining < 0;

          return (
            <div
              key={item.id}
              className={`budget-card ${remaining === 0
                  ? "yellow"
                  : remaining < 0
                    ? "red"
                    : "green"
                }`}
              onClick={() => handleEdit(item)}
            >
              <h3>{item.category}</h3>
              <p>
                <strong>Month:</strong> {item.month || "N/A"}
              </p>
              <p>
                <strong>Budget:</strong> ₹{item.total}
              </p>
              <p>
                <strong>Spent:</strong> ₹{item.spent}
              </p>
              <p>
                <strong>Remaining:</strong> ₹{remaining}
              </p>
              {remaining < 0 && (
                <p className="warning-text">🚨 Over Budget by ₹{Math.abs(remaining)}</p>
              )}
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default BudgetPage;








{/*
import React, { useState, useEffect } from "react";
import { db } from "../../LoginPage/firebase";
import { useUser } from "../../context/UserContext";
import BudgetChart from "./BudgetChart";
import "./BudgetPage.css";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const BudgetPage = () => {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState("");
  const [spent, setSpent] = useState("");

  const fetchBudgets = async () => {
    try {
      if (!user || !user.uid) return;
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "budgets")
      );

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const handleAddOrUpdate = async () => {
    try {
      if (!user || !user.uid) {
        console.error("User not logged in or UID missing");
        return;
      }

      const budgetsRef = collection(db, "users", user.uid, "budgets");

      const q = query(budgetsRef, where("category", "==", category));
      const querySnapshot = await getDocs(q);

      const newBudget = {
        category,
        total: parseFloat(total),
        spent: parseFloat(spent),
      };

      if (!querySnapshot.empty) {
        // If budget with same category exists, update it
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, "users", user.uid, "budgets", docId);
        await updateDoc(docRef, newBudget);
      } else {
        // Add new budget
        const newDocRef = doc(budgetsRef); // creates new doc with random ID
        await setDoc(newDocRef, newBudget);
      }

      fetchBudgets(); // Refresh UI
      setCategory("");
      setTotal("");
      setSpent("");
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  return (
    <div className="budget-container">
      <h1>Budget Planner</h1>
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
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Spent"
          value={spent}
          onChange={(e) => setSpent(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>Add</button>
      </div>


      <div className="chart-section">
        <BudgetChart data={budgets} />
      </div>


      <div className="budget-list">
        {budgets.map((item) => {
          const remaining = item.total - item.spent;
          const over = remaining < 0;

          return (
            <div
              key={item.id}
              className={`budget-item ${over ? "over-budget" : ""}`}
            >
              <h3>{item.category}</h3>
              <p>Total: ₹{item.total}</p>
              <p>Spent: ₹{item.spent}</p>
              <p>Remaining: ₹{remaining}</p>
              {over && <p className="warning-text">⚠️ Over Budget!</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPage;
*/}





{/*
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

      
      <div className="month-filter">
        <label>Filter by Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      
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
          <button onClick={handleDelete} style={{ backgroundColor: "#fc6a03", color: "white" }}>
            Delete Selected
          </button>
        )}

        <button onClick={() => {
          localStorage.removeItem("budgets");
          setBudgets([]);
        }} style={{backgroundColor: "#D30000"}} >
          Clear All Budgets
        </button>
      </div>

      
      <div className="chart-section">
        <BudgetChart data={filteredBudgets} />
      </div>

      
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
    </div>
  );
};

export default BudgetPage;
*/}