import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!matchedUser) {
      alert("Invalid credentials. Try again.");
      return;
    }

    login({ name: matchedUser.name, email: matchedUser.email });
    navigate("/");
  };

  return (
    <div className="auth-modern-wrapper">
      <form className="auth-card-glass" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Welcome back! Please login to your account.</p>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={form.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="btn-modern">Login</button>

        <div className="redirect-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>

      </form>
    </div>
  );
};

export default Login;










{/*
import React from 'react'
import './login.css'
import Image from "../../src/assets/Login.webp"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()


    const handleLogin = () => {
        if (username.length < 3) {
            setErrorMessage('Username must be of 3 characters.')
            return
        }

        if (password.length < 8) {
            setErrorMessage('Password must be of 8 characters.')
            return
        }

        navigate('/')
    }

    return (
        <div className='login-page'>
            <div className="login-container">

                <img src={Image} alt="Login" />

                <div className='loginMain'>
                    <h1>Log In</h1>
                    <br />

                    <p>{errorMessage && <div style={{ color: 'red' }} className="error-message">!!!{errorMessage}!!!</div>}</p>

                    <div className="login">
                        <label htmlFor="username">Username:</label>
                        <br />
                        <input
                            type="text"
                            id='username'
                            placeholder='Enter Your Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <hr />
                        <br />

                        <label htmlFor="pass">Password:</label>
                        <input
                            type="password"
                            id='pass'
                            placeholder='Enter Your Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <hr />
                    </div>

                    <div className="footer">
                        <button className='Lfooter-button' onClick={handleLogin}>Log In</button>

                        <p>OR</p>

                        <Link to="/signup">
                            SignUp
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default Login;*/}