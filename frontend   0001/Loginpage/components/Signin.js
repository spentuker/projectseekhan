import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Signin.css';

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(false); // Track sign-in status

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrEmail("");
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        setErrPassword("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!email) {
            setErrEmail("Email is required.");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrEmail("Invalid email format.");
            isValid = false;
        }

        if (!password) {
            setErrPassword("Password is required.");
            isValid = false;
        } else if (password.length < 6) {
            setErrPassword("Password must be at least 6 characters.");
            isValid = false;
        }

        if (isValid) {
            try {
                console.log('User signed in successfully');
                setEmail("");
                setPassword("");
                setIsSignedIn(true); // Update state to show welcome message
                navigate("/"); // Optionally navigate to another route
            } catch (error) {
                console.error('Error signing in:', error);
                setErrEmail('Email ID is not registered');
            }
        }
    };

    return (
        <div className="signin-container">
            <header className="logo-header">
                <a href="#">
                    <img className="logo" src="https://i.ibb.co/VNsQfQG/Screenshot-2024-10-23-142940-removebg-preview.png" alt="logo" />
                </a>
            </header>
            {isSignedIn ? (
                <div className="welcome-message">
                    <h1>Welcome!</h1>
                    <p>You have successfully signed in.</p>
                </div>
            ) : (
                <div className="signin-wrapper">
                    <form className="signin-form" onSubmit={handleLogin}>
                        <div className="signin-form-content">
                            <h2 className="signin-title">Sign in</h2>
                            <div className="signin-inputs">
                                <div className="signin-input-group">
                                    <p className="signin-label">Email or mobile phone number</p>
                                    <input
                                        onChange={handleEmail}
                                        value={email}
                                        className="signin-input"
                                        type="email"
                                    />
                                    {errEmail && (
                                        <p className="signin-error">
                                            <span className="signin-error-icon">!</span>
                                            {errEmail}
                                        </p>
                                    )}
                                </div>
                                <div className="signin-input-group">
                                    <p className="signin-label">Password</p>
                                    <input
                                        onChange={handlePassword}
                                        value={password}
                                        className="signin-input"
                                        type="password"
                                    />
                                    {errPassword && (
                                        <p className="signin-error">
                                            <span className="signin-error-icon">!</span>
                                            {errPassword}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="signin-button">Sign-In</button>
                            <p className="signin-terms">
                                By continuing, you agree to Seekhan's 
                                <span className="signin-link"> Conditions of Use </span>
                                and 
                                <span className="signin-link"> Privacy Notice</span>.
                            </p>
                            <div className="signin-help">
                                <span className="signin-link-help">Need help?</span>
                            </div>
                            <div className="signin-divider">
                                <span className="signin-divider-line"></span>
                                <span className="signin-divider-text">New to Seekhan?</span>
                                <span className="signin-divider-line"></span>
                            </div>
                            <Link to="/registration" className="signin-create-account-link">
                                <button className="signin-create-account-button">Create your Seekhan account</button>
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Signin;
