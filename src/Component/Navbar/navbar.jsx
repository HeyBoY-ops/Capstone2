import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./navbar.css";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">SmartBudget</Link>
        <div className="nav-links">
          <Link to="/budget">Budget Planner</Link>
          <Link to="/blog">Blog</Link>
          {user ? (
            <div className="navbar-user">
              <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt="avatar" />
              <span>{user.name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

        </div>
      </div>
    </nav>

  );
};

export default Navbar;