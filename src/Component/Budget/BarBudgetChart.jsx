import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const spent = payload.find(p => p.dataKey === "spent")?.value || 0;
        const budget = payload.find(p => p.dataKey === "budget")?.value || 0;
        const remaining = budget - spent;
        const overBudget = spent > budget;

        return (
            <div
                style={{
                    background: "white",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                }}
            >
                <strong>{label}</strong>
                <p>💰 Budget: ₹{budget}</p>
                <p>🧾 Spent: ₹{spent}</p>
                <p style={{ color: overBudget ? "red" : "green" }}>
                    {overBudget ? `🚨 Over Budget by ₹${Math.abs(remaining)}` : `✅ Remaining: ₹${remaining}`}
                </p>
            </div>
        );
    }
    return null;
};

const BarBudgetChart = ({ data }) => {
    const chartData = data.map((item) => ({
        category: item.category,
        spent: item.spent,
        budget: item.budget,
    }));

    return (
        <div style={{ width: "100%", height: 380 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="budget" fill="#8884d8" name="Budget" label={{ position: "top", fill: "#8884d8" }} />
                    <Bar dataKey="spent" fill="#ff8042" name="Spent" label={{ position: "top", fill: "#ff8042" }} />

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarBudgetChart;
