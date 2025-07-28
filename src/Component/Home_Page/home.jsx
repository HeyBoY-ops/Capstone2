import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../LoginPage/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { FaGithub } from "react-icons/fa";
import "./Home.css";

function Home() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overspentCount: 0,
  });
  const [isDemoMode, setIsDemoMode] = useState(false);

  const defaultBudgets = [
    { category: "Food", total: 5000, spent: 2500, month: "January" },
    { category: "Travel", total: 10000, spent: 18000, month: "February" },
    { category: "Shopping", total: 3000, spent: 3000, month: "March" },
  ];

  const fetchBudgetStats = async () => {
    try {
      let budgets = [];
      if (user) {
        const userBudgetRef = collection(db, "users", user.uid, "budgets");
        const snapshot = await getDocs(userBudgetRef);
        budgets = snapshot.docs.map((doc) => doc.data());

        if (budgets.length === 0) {
          setIsDemoMode(false);
          setStats({
            totalCategories: 0,
            totalBudget: 0,
            totalSpent: 0,
            totalRemaining: 0,
            overspentCount: 0,
          });
          return;
        } else {
          setIsDemoMode(false);
        }
      } else {
        budgets = defaultBudgets;
        setIsDemoMode(true);
      }

      const totalCategories = budgets.length;
      const totalBudget = budgets.reduce((sum, item) => sum + Number(item.total || 0), 0);
      const totalSpent = budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
      const totalRemaining = totalBudget - totalSpent;
      const overspentCount = budgets.filter(item => Number(item.spent) > Number(item.total)).length;

      setStats({ totalCategories, totalBudget, totalSpent, totalRemaining, overspentCount });
    } catch (error) {
      console.error("Error fetching budget stats:", error);
      setIsDemoMode(true);
      const totalCategories = defaultBudgets.length;
      const totalBudget = defaultBudgets.reduce((sum, item) => sum + item.total, 0);
      const totalSpent = defaultBudgets.reduce((sum, item) => sum + item.spent, 0);
      const totalRemaining = totalBudget - totalSpent;
      const overspentCount = defaultBudgets.filter(item => item.spent > item.total).length;
      setStats({ totalCategories, totalBudget, totalSpent, totalRemaining, overspentCount });
    }
  };

  useEffect(() => {
    fetchBudgetStats();
  }, [user]);

  const handleIconClick = (url) => {
    if (user) {
      window.open(url, "_blank");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      alert("Please login to view social profiles!");
    }
  };

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
        <div className="stats-cards fade-in">
          <div className="card"><h3>Total Categories</h3><p>{stats.totalCategories.toLocaleString()}</p></div>
          <div className="card"><h3>Total Budgeted</h3><p>₹{stats.totalBudget.toLocaleString()}</p></div>
          <div className="card"><h3>Total Spent</h3><p>₹{stats.totalSpent.toLocaleString()}</p></div>
          <div className="card"><h3>Total Remaining</h3><p>₹{stats.totalRemaining.toLocaleString()}</p></div>
          <div className="card"><h3>Overspent Categories</h3><p>{stats.overspentCount}</p></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="feature-cards">
          <Link to="/budget" className="card-link"><div className="card"><h3>Smart Budgeting</h3><p>Track your spending vs budget. Get alerts when expenses exceed your plan.</p></div></Link>
          <Link to="/monthly-breakdown" className="card-link"><div className="card"><h3>Monthly Breakdown</h3><p>Filter expenses by month and category. View beautiful charts.</p></div></Link>
          <Link to="/blog" className="card-link"><div className="card"><h3>Blog Tips</h3><p>Read finance advice, savings tips, and money management tricks.</p></div></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer fancy-footer">
        <div className="footer-content">
          <div className="social-icons">
            <FaGithub onClick={() => handleIconClick("https://github.com/HeyBoY-ops/Capstone2")} />
          </div>
          <p>© {new Date().getFullYear()} SmartBudget. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
}

export default Home;










{/*
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../LoginPage/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import "./Home.css";

function Home() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overspentCount: 0,
  });
  
  const defaultBudgets = [
    { category: "Food", total: 5000, spent: 2500, month: "January" },
    { category: "Travel", total: 10000, spent: 18000, month: "February" },
    { category: "Shopping", total: 3000, spent: 3000, month: "March" }
  ];



  const fetchBudgetStats = async () => {
    if (!user) return;
  
    try {
      const budgetRef = collection(db, "users", user.uid, "budgets");
      const snapshot = await getDocs(budgetRef);
  
      const budgets = snapshot.docs.map(doc => doc.data());
  
      const totalCategories = budgets.length;
      const totalBudget = budgets.reduce((sum, item) => sum + Number(item.total || 0), 0);
      const totalSpent = budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
      const totalRemaining = totalBudget - totalSpent;
      const overspentCount = budgets.filter(item => Number(item.spent) > Number(item.total)).length;
  
      setStats({ totalCategories, totalBudget, totalSpent, totalRemaining, overspentCount });
    } catch (error) {
      console.error("Error fetching budget stats:", error);
    }
  };

  

  useEffect(() => {
    fetchBudgetStats();
  }, [user]);

  return (
    <div className="home-container">

      <section className="hero">
        <h1>Welcome to SmartBudget</h1>
        <p>Plan, Track, and Control Your Budget Easily.</p>
        <div className="hero-buttons">
          <Link to="/budget"><button className="btn planner">Budget Planner</button></Link>
          <Link to="/blog"><button className="btn blog">Read Blog</button></Link>
        </div>
      </section>


      <section className="live-stats">
        <h2>Live Budget Stats</h2>
        <div className="stats-cards">
          <div className="card">
            <h3>Total Categories</h3>
            <p>{stats.totalCategories.toLocaleString()}</p>
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


      <footer className="footer">
        © {new Date().getFullYear()} SmartBudget. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
*/}



