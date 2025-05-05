import React from "react"
import './navbar.css'
import { Link } from 'react-scroll'

function Navbar() {
  return (
    <div>
    <nav className="navbar">
      <div className="navLeft">
        MyBrand
      </div>

      <div className="navRight">
        <a>Home</a>
        <a>About</a>
        <a>services</a>
        <a>Blog</a>
        <Link className="desktopMenuListItem"></Link>

      </div>

      <div className="button">
        <button className="button1">Login</button>
        <button className="button2">Signup</button>
      </div>
      
    </nav>
    </div>

  )

}

export default Navbar;