import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About BudgetWise</h1>
      <p>
        BudgetWise is your all-in-one personal finance assistant. It helps you plan, track, and
        manage your expenses with ease and clarity.
      </p>

      <h2>Key Features:</h2>
      <ul>
        <li>Create custom budget categories (e.g., Food, Rent, Travel)</li>
        <li>Track your expenses and view detailed breakdowns</li>
        <li>Interactive charts to compare budget vs. spending</li>
        <li>Instant alerts when budgets are exceeded</li>
        <li>Set recurring expense reminders</li>
      </ul>

      <h2>Our Mission:</h2>
      <p>
        Our goal is to make budgeting effortless and effective, helping users develop better
        financial habits and achieve their savings goals.
      </p>
    </div>
  );
};

export default About;
