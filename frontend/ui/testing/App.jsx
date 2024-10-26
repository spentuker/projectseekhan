import React, { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState([]);
  useEffect(() => {
    const handleEnterKeyPress = (e) => {
      if (e.key === "Enter") {
        getTrigger();
      }
    };

    document.addEventListener("keypress", handleEnterKeyPress);
    return () => {
      document.removeEventListener("keypress", handleEnterKeyPress);
    };
  }, [inputValue]);

  async function getTrigger() {
    try {
      const response = await fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_prompt: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log(data);
      setCount(count + 1);
      setValues([...values, data.message]);
      setInputValue("");
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }

  return (
    <>
      <h2>seekhan</h2>
      <div className="input-container">
        {values.map((value, index) => (
          <p key={index} className={`new-${count}`}>
            {value}
          </p>
        ))}
      </div>
      <input
        type="text"
        className="input-button"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      />
      <button onClick={getTrigger}>Submit</button>
    </>
  );
}

export default App;
