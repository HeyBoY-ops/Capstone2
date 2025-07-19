import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./login.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Save additional data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      // Set user in context
      login({ name: form.name, email: form.email });

      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert(error.message);
    }
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
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;






{/*try{
  await createUserWithEmailAndPassword(auth, form.email, form.password);
  const user = auth.currentUser;
  console.log(user);
  if (user) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: form.name,
      email: user.email,
    });
  }
  console.log("User Registered Sucessfully!!!")
  navigate("/login");
}catch (error){
  console.log(error.message);
};
*/}


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