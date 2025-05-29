import React, { useState, useEffect } from "react";
import "./MonthlyBreakdown.css";
import BarBudgetChart from "../Component/Budget/BarBudgetChart";


const MonthlyBreakdown = () => {
    const [budgets, setBudgets] = useState([]);
    const [filteredMonth, setFilteredMonth] = useState("");
    const [filteredCategory, setFilteredCategory] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("budgets")) || [];
        setBudgets(stored);
    }, []);

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

                {filteredBudgets.map((item, i) => (
                    <div key={i} className={`breakdown-card ${item.spent > item.budget ? "over-budget" : ""}`}>
                        <h3>{item.category}</h3>
                        <p><strong>Month:</strong> {item.month || "N/A"}</p>
                        <p><strong>Budget:</strong> ₹{item.budget}</p>
                        <p><strong>Spent:</strong> ₹{item.spent}</p>
                        <p><strong>Remaining:</strong> ₹{item.budget - item.spent}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default MonthlyBreakdown;
