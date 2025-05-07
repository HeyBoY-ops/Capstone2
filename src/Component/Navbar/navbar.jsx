import React from "react";
import './navbar.css';
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (shouldHideNavbar) return null;

  return (
    <nav className="navbar">
      <div className="navLeft">
        <Link to="/" className="brand">MyBrand</Link>
      </div>

      <div className="navRight">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/budget">Budget Planner</Link>
      </div>

      <div className="button">
        <Link to="/login">
          <button className="button1">Login</button>
        </Link>
        <Link to="/signup">
          <button className="button2">Signup</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
