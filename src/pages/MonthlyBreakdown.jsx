import React, { useState, useEffect } from "react";
import "./MonthlyBreakdown.css";
import BarBudgetChart from "../Component/Budget/BarBudgetChart";
import { db } from "../LoginPage/firebase";
import { useUser } from "../context/UserContext";
import { collection, getDocs } from "firebase/firestore";

const MonthlyBreakdown = () => {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [filteredMonth, setFilteredMonth] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const defaultBudgets = [
    { id: "1", category: "Food", total: 5000, spent: 2500, month: "January" },
    { id: "2", category: "Travel", total: 10000, spent: 18000, month: "February" },
    { id: "3", category: "Shopping", total: 3000, spent: 3000, month: "March" }
  ];

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user) {
        setBudgets(defaultBudgets);
        setIsDemoMode(true);
        return;
      }

      try {
        const ref = collection(db, "users", user.uid, "budgets");
        const snapshot = await getDocs(ref);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (data.length === 0) {
          setBudgets([]);  // empty (let user add)
          setIsDemoMode(false);
        } else {
          setBudgets(data);
          setIsDemoMode(false);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setBudgets(defaultBudgets);
        setIsDemoMode(true);
      }
    };

    fetchBudgets();
  }, [user]);

  const filteredBudgets = budgets.filter(item => {
    const matchesMonth = filteredMonth ? item.month === filteredMonth : true;
    const matchesCategory = filteredCategory ? item.category === filteredCategory : true;
    return matchesMonth && matchesCategory;
  });

  const uniqueMonths = [...new Set(budgets.map(b => b.month))];
  const uniqueCategories = [...new Set(budgets.map(b => b.category))];

  return (
    <div className="monthly-breakdown">
      <h2>Monthly Breakdown</h2>

      {isDemoMode && (
        <div className="demo-banner">🧪 Demo mode: changes won’t be saved after refresh.</div>
      )}

      <div className="filters">
        <select value={filteredMonth} onChange={(e) => setFilteredMonth(e.target.value)}>
          <option value="">All Months</option>
          {uniqueMonths.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        <select value={filteredCategory} onChange={(e) => setFilteredCategory(e.target.value)}>
          <option value="">All Categories</option>
          {uniqueCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="breakdown-chart">
        {filteredBudgets.length > 0 && <BarBudgetChart data={filteredBudgets} />}
      </div>

      <div className="breakdown-list">
        {filteredBudgets.length === 0 && (
          <div className="no-data-message fade-in">
            <p>
              {isDemoMode
                ? "No demo data available for the selected filter."
                : "➕ Add your budget data to get started or try a different filter!"}
            </p>
          </div>
        )}

        {filteredBudgets.map(item => {
          const remaining = item.total - item.spent;
          const cardColor = remaining === 0 ? "yellow" : remaining < 0 ? "red" : "green";

          return (
            <div key={item.id} className={`budget-card ${cardColor}`}>
              <h3>{item.category}</h3>
              <p><strong>Month:</strong> {item.month || "N/A"}</p>
              <p><strong>Budget:</strong> ₹{item.total}</p>
              <p><strong>Spent:</strong> ₹{item.spent}</p>
              <p><strong>Remaining:</strong> ₹{remaining}</p>
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

export default MonthlyBreakdown;







{/*
import React, { useState, useEffect } from "react";
import "./MonthlyBreakdown.css";
import BarBudgetChart from "../Component/Budget/BarBudgetChart";
import { db } from "../LoginPage/firebase";
import { useUser } from "../context/UserContext";
import { collection, getDocs } from "firebase/firestore";


const MonthlyBreakdown = () => {
    const { user } = useUser();
    const [budgets, setBudgets] = useState([]);
    const [filteredMonth, setFilteredMonth] = useState("");
    const [filteredCategory, setFilteredCategory] = useState("");


    useEffect(() => {
        const fetchBudgets = async () => {
            if (!user) return;
            const ref = collection(db, "users", user.uid, "budgets");
            const snapshot = await getDocs(ref);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBudgets(data);
        };
        fetchBudgets();
    }, [user]);


    const filteredBudgets = budgets.filter((item) => {
        const matchesMonth = filteredMonth ? item.month === filteredMonth : true;
        const matchesCategory = filteredCategory ? item.category === filteredCategory : true;
        return matchesMonth && matchesCategory;
    });

    const uniqueMonths = [...new Set(budgets.map((b) => b.month))];
    const uniqueCategories = [...new Set(budgets.map((b) => b.category))];

    return (
        <div className="monthly-breakdown">
            <h2>Monthly Breakdown</h2>
            <div className="filters">
                <select onChange={(e) => setFilteredMonth(e.target.value)} value={filteredMonth}>
                    <option value="">All Months</option>
                    {uniqueMonths.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                    ))}
                </select>

                <select onChange={(e) => setFilteredCategory(e.target.value)} value={filteredCategory}>
                    <option value="">All Categories</option>
                    {uniqueCategories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="breakdown-chart">
                {filteredBudgets.length > 0 && (
                    <div className="breakdown-chart">
                        <BarBudgetChart data={filteredBudgets} />
                    </div>
                )}

            </div>


            <div className="breakdown-list">
                {filteredBudgets.length === 0 && (
                    <div className="no-data-message">
                        <p>No budget entries found for the selected month. Try adding a new budget or choosing a different month.</p>
                    </div>
                )}


                {filteredBudgets.map((item, index) => {
                    const remaining = item.total - item.spent;
                    let cardColor = "";

                    if (remaining === 0) cardColor = "yellow";
                    else if (remaining < 0) cardColor = "red";
                    else cardColor = "green";

                    return (
                        <div key={index} className={`budget-card ${cardColor}`}>
                            <h3>{item.category}</h3>
                            <p><strong>Month:</strong> {item.month || "N/A"}</p>
                            <p><strong>Budget:</strong> ₹{item.total}</p>
                            <p><strong>Spent:</strong> ₹{item.spent}</p>
                            <p><strong>Remaining:</strong> ₹{item.total - item.spent}</p>
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

export default MonthlyBreakdown;
*/}