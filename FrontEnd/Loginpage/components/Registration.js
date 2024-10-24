import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
    const [clientName, setClientName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [address, setAddress] = useState(""); 
    
    const [errClientName, setErrClientName] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [errCPassword, setErrCPassword] = useState("");
    const [errAddress, setErrAddress] = useState(""); 

    const navigate = useNavigate();

    const handleName = (e) => {
        setClientName(e.target.value);
        setErrClientName("");
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrEmail("");
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setErrPassword("");
    }
    const handleCPassword = (e) => {
        setCPassword(e.target.value);
        setErrCPassword("");
    }
    const handleAddress = (e) => {
        setAddress(e.target.value);
        setErrAddress("");
    }

    const emailValidation = (email) => {
        return String(email).toLowerCase().match(/^\w+([-]?\w+)@\w+([-]?\w+)(\.\w{2,3})+$/);
    }

    const handleRegistration = async (e) => {
        e.preventDefault();

        let isValid = true;

        if (!clientName) {
            setErrClientName("Enter your name");
            isValid = false;
        }
        if (!email) {
            setErrEmail("Enter your email");
            isValid = false;
        } else if (!emailValidation(email)) {
            setErrEmail("Enter a valid email");
            isValid = false;
        }
        if (!password) {
            setErrPassword("Enter your password");
            isValid = false;
        } else if (password.length < 6) {
            setErrPassword("Passwords must be at least 6 characters.");
            isValid = false;
        }
        if (!cPassword) {
            setErrCPassword("Confirm your password");
            isValid = false;
        } else if (cPassword !== password) {
            setErrCPassword("Password Not Matched");
            isValid = false;
        }
        if (!address) {
            setErrAddress("Enter your address");
            isValid = false;
        }

        if (isValid) {
            try {
                console.log('User registered successfully');
                setClientName("");
                setEmail("");
                setPassword("");
                setCPassword("");
                setAddress("");
                navigate("/");
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }
    }

    return (
        <div className="register-container">
            <header className="logo-header">
                <a href="#">
                    <img className="logo" src="https://i.ibb.co/VNsQfQG/Screenshot-2024-10-23-142940-removebg-preview.png" alt="logo" />
                </a>
            </header>
            <div className="register-wrapper">
                <form className="register-form" onSubmit={handleRegistration}>
                    <div className="register-form-content">
                        <h2 className="register-title">Create account</h2>
                        <div className="register-input-group">
                            <p className="register-label">Your name</p>
                            <input
                                onChange={handleName}
                                value={clientName}
                                className="register-input"
                                type="text"
                            />
                            {errClientName && (
                                <p className="register-error">
                                    <span className="register-error-icon">!</span>
                                    {errClientName}
                                </p>
                            )}
                        </div>
                        <div className="register-input-group">
                            <p className="register-label">Email</p>
                            <input
                                onChange={handleEmail}
                                value={email}
                                className="register-input"
                                type="email"
                            />
                            {errEmail && (
                                <p className="register-error">
                                    <span className="register-error-icon">!</span>
                                    {errEmail}
                                </p>
                            )}
                        </div>
                        <div className="register-input-group">
                            <p className="register-label">Password</p>
                            <input
                                onChange={handlePassword}
                                value={password}
                                className="register-input"
                                type="password"
                                placeholder="At least 6 characters"
                            />
                            {errPassword && (
                                <p className="register-error">
                                    <span className="register-error-icon">!</span>
                                    {errPassword}
                                </p>
                            )}
                        </div>
                        <div className="register-input-group">
                            <p className="register-label">Re-enter password</p>
                            <input
                                onChange={handleCPassword}
                                value={cPassword}
                                className="register-input"
                                type="password"
                            />
                            {errCPassword && (
                                <p className="register-error">
                                    <span className="register-error-icon">!</span>
                                    {errCPassword}
                                </p>
                            )}
                        </div>
                        <div className="register-input-group">
                            <p className="register-label">Address</p>
                            <input
                                onChange={handleAddress}
                                value={address}
                                className="register-input"
                                type="text"
                            />
                            {errAddress && (
                                <p className="register-error">
                                    <span className="register-error-icon">!</span>
                                    {errAddress}
                                </p>
                            )}
                        </div>
                        <button type="submit" className="register-button">Create Account</button>
                        <p className="register-terms">
                            By creating an account, you agree to Vantage's 
                            <span className="register-link"> Conditions of Use </span>
                            and 
                            <span className="register-link"> Privacy Notice</span>.
                        </p>
                    </div>
                </form>
                <div className="register-signin">
                    <p>Already have an account?</p>
                    <Link to="/signin" className="register-signin-link">Sign-In</Link>
                </div>
            </div>
            <footer className="register-footer">
                <div className="register-footer-links">
                    <span className="register-footer-link">Conditions of Use</span>
                    <span className="register-footer-link">Privacy Notice</span>
                    <span className="register-footer-link">Help</span>
                </div>
                <p className="register-footer-text">© 1996-2024, Vantage.com, Inc. or its affiliates</p>
            </footer>
        </div>
    );
};

export default Registration;
