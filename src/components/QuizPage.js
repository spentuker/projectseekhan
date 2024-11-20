// QuizPage.js
import React, { useState } from 'react';
import './QuizPage.css';

const QuizPage = () => {
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState('Medium');

  return (
    <div className="quiz-container">
      <nav className="navbar">
        <h2 className="logo">seekhan</h2>
        <div className="nav-links">
          <a href="/dashboard">Home</a>
          <a href="/quiz">Quiz</a>
          <a href="/contact">Contact Us</a>
          <div className="profile">Mrs. Pooja Dixit</div>
        </div>
      </nav>

      <div className="quiz-settings">
        <h3>Class: Design and Analysis of Algorithms</h3>
        <label>Enter Topic:</label>
        <input type="text" placeholder="Enter topic here" />

        <label>Enter number of Questions: {questionCount}</label>
        <input
          type="range"
          min="1"
          max="50"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        />

        <label>Select the difficulty: {difficulty}</label>
        <input
          type="range"
          min="1"
          max="3"
          onChange={(e) => {
            const value = e.target.value;
            setDifficulty(value === '1' ? 'Easy' : value === '2' ? 'Medium' : 'Hard');
          }}
        />

        <label>Upload your notes:</label>
        <input type="file" />

        <label>Write here for any specifications</label>
        <textarea placeholder="Enter specifications here"></textarea>

        <button className="generate-button">Generate Quiz</button>
      </div>
    </div>
  );
};

export default QuizPage;
