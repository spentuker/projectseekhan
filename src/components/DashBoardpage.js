// DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for better SPA navigation
import './DashboardPage.css';
import logo from '../assets/logo512.png';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <img src={logo} alt="Seekhan Logo" className="logo-image" />
        <div className="nav-links">
          <Link to="/dashboard">Home</Link> {/* Update Home link to stay on dashboard */}
          <Link to="/quiz">Quiz</Link>
          <Link to="/contact">Contact Us</Link>
          <div className="profile">Mrs. Pooja Dixit</div>
        </div>
      </nav>

      <section className="classes-section">
        <h3>Classes:</h3>
        <div className="class-cards">
          <div className="class-card">3 - 1 PS Audi Java</div>
          <div className="class-card">2 - 1 PS SDC</div>
          <div className="class-card">2 - 1 PS Audi Java</div>
        </div>
      </section>

      <section className="past-quizzes-section">
        <h3>Past Quizzes</h3>
        <div className="quiz-cards">
          <div className="quiz-card">
            <p>Classes</p>
            <p>Python</p>
            <p>Date: 12-10-2024</p>
          </div>
          <div className="quiz-card">
            <p>Design and Analysis of Algorithms</p>
            <p>Java</p>
            <p>Date: 21-09-2024</p>
          </div>
          <div className="quiz-card">
            <p>Data Structures</p>
            <p>C++</p>
            <p>Date: 15-09-2024</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
