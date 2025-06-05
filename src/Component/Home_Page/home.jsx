import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overspentCount: 0,
  });

  const updateStatsFromStorage = () => {
    const stored = JSON.parse(localStorage.getItem("budgets")) || [];
    const totalCategories = stored.length;
    const totalBudget = stored.reduce((sum, item) => sum + Number(item.budget || 0), 0);
    const totalSpent = stored.reduce((sum, item) => sum + Number(item.spent || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    const overspentCount = stored.filter(item => Number(item.spent) > Number(item.budget)).length;
    setStats({ totalCategories, totalBudget, totalSpent, totalRemaining, overspentCount });
  };

  useEffect(() => {
    updateStatsFromStorage();

    const onStorageChange = (e) => {
      if (e.key === "budgets") {
        updateStatsFromStorage();
      }
    };
    window.addEventListener("storage", onStorageChange);

    const onBudgetsUpdated = () => {
      updateStatsFromStorage();
    };
    window.addEventListener("budgetsUpdated", onBudgetsUpdated);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("budgetsUpdated", onBudgetsUpdated);
    };
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to SmartBudget</h1>
        <p>Plan, Track, and Control Your Budget Easily.</p>
        <div className="hero-buttons">
          <Link to="/budget"><button className="btn planner">Budget Planner</button></Link>
          <Link to="/blog"><button className="btn blog">Read Blog</button></Link>
        </div>
      </section>

      {/* Live Budget Stats Section */}
      <section className="live-stats">
        <h2>Live Budget Stats</h2>
        <div className="stats-cards">
          <div className="card">
            <h3>Total Categories</h3>
            <p>{stats.totalCategories}</p>
          </div>
          <div className="card">
            <h3>Total Budgeted</h3>
            <p>₹{stats.totalBudget.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Total Spent</h3>
            <p>₹{stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Total Remaining</h3>
            <p>₹{stats.totalRemaining.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Overspent Categories</h3>
            <p>{stats.overspentCount}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">

        <h2>Features</h2>
        <div className="feature-cards">
          
          <Link to="/budget" className="card-link">
            <div className="card">
              <h3>Smart Budgeting</h3>
              <p>Track your spending vs budget. Get alerts when expenses exceed your plan.</p>
            </div>
          </Link>

          <Link to="/monthly-breakdown" className="card-link">
            <div className="card">
              <h3>Monthly Breakdown</h3>
              <p>Filter expenses by month and category. View beautiful and meaningful charts.</p>
            </div>
          </Link>


          <Link to="/blog" className="card-link">
            <div className="card">
              <h3>Blog Tips</h3>
              <p>Read finance advice, savings tips, and money management tricks from experts.</p>
            </div>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} SmartBudget. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
