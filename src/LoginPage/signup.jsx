import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./login.css";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.email === form.email);
    if (userExists) {
      alert("User already exists. Please login.");
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    login({ name: newUser.name, email: newUser.email });
    navigate("/");
  };

  return (
    <div className="auth-modern-wrapper">
      <form className="auth-card-glass" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Welcome! Please fill in the details to sign up.</p>

        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder=" "
            value={form.name}
            onChange={handleChange}
            required
          />
          <label>Full Name</label>
        </div>

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

        <button type="submit" className="btn-modern">Sign Up</button>

        <div className="redirect-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;









{/*
import React from 'react'
import './signup.css'
import Image from '../../src/assets/Login.webp'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'

function SignUp() {
    const [fullName, setfullName] = useState('')
    const [username, setuserName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    const handleSignup = () => {
        if(fullName.length < 3) {
            setErrorMessage('Enter a Valid Name')
            return
        }

        if(username.length < 3) {
            setErrorMessage('Enter a Valid UserName')
            return
        }

        if(password.length < 8){
            setErrorMessage('Password must be of 8 characters')
            return
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        navigate('/')
    }

    return (
        <div className="container">

            <img src={Image} alt="SignUp" />

            <div className='signupMain'>
            <h1>Sign Up</h1>
            <br />

            {errorMessage && <div style={{color:'red'}} className="error-message">!!!{errorMessage}!!!</div>}
            
            <div className="signup">
                <label htmlFor="fullName">FullName:</label>
                <br />
                <input 
                type="text" 
                id='fullName' 
                placeholder='Enter your FullName'
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                />
                <hr />
                <br />

                <label htmlFor="username">Username:</label>
                <br />
                <input 
                type="text" 
                id='username' 
                placeholder='Create Your Username'
                value={username}
                onChange={(e) => setuserName(e.target.value)}
                />
                <hr />
                <br />
                
                <label htmlFor="pass">Password:</label>
                <br />
                <input 
                type="password" 
                id='pass' 
                placeholder='Create Your Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <hr />
                <br />
                
                <label htmlFor="email">Email:</label>
                <br />
                <input 
                type="email" 
                id='email' 
                placeholder='Enter Your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <hr />
                <br />
            </div>

            <div className="footer">
                <button className='signup-button' onClick={handleSignup}>Sign Up</button>

                <p>OR</p>


                <Link to="/login">
                    Login
                </Link>
                
            </div>

            </div>
        </div>
    )
}


export default SignUp;*/}