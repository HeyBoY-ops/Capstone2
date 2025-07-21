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
  LabelList,
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
          background: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "0.9rem",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <strong>{label}</strong>
        <p>💰 Budget: ₹{budget}</p>
        <p>🧾 Spent: ₹{spent}</p>
        <p style={{ color: overBudget ? "red" : "green" }}>
          {overBudget
            ? `🚨 Over Budget by ₹${Math.abs(remaining)}`
            : `✅ Remaining: ₹${remaining}`}
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
    budget: item.total,
  }));

  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis
            label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Budget Bar */}
          <Bar dataKey="budget" fill="#8884d8" name="Budget">
            <LabelList
              dataKey="budget"
              position="top"
              formatter={(value) => `₹${value}`}
            />
          </Bar>
          
          {/* Spent Bar */}
          <Bar dataKey="spent" fill="#ff8042" name="Spent">
            <LabelList
              dataKey="spent"
              position="top"
              formatter={(value) => `₹${value}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarBudgetChart;
