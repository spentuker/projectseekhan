// LoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to the dashboard page
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h1 className="welcome-text">Welcome to Seekhan!</h1>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
