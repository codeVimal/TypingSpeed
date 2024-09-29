import React, { useState, useEffect } from 'react';
import './App.css';

const TypingTest = () => {
  const [text, setText] = useState(''); // Text to type
  const [inputValue, setInputValue] = useState(''); // User input
  const [startTime, setStartTime] = useState(null); // Start time
  const [endTime, setEndTime] = useState(null); // End time
  const [wpm, setWpm] = useState(0); // Words per minute
  const [isTestStarted, setIsTestStarted] = useState(false); // If test is started
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state for API call
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  // Fetch random text when the component mounts or on restart
  useEffect(() => {
    fetchRandomText();
  }, []);

  const fetchRandomText = async () => {
    setLoading(true); // Set loading state to true before fetching
    setError(null); // Clear any previous error
    try {
      const response = await fetch('https://quotes-api-self.vercel.app/quote'); // Fetch from quotes API
      if (!response.ok) {
        throw new Error('Failed to fetch the text');
      }
      const data = await response.json();
      if (data && data.quote) {
        setText(data.quote); // Extract the quote
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      console.error("Error fetching text:", error.message);
      setError("Could not fetch text. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false after fetch
    }
  };

  useEffect(() => {
    if (inputValue === text) {
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds
      const wordsTyped = text.split(" ").length;
      setWpm(Math.round((wordsTyped / timeTaken) * 60)); // Words per minute
    }
  }, [endTime, inputValue, text, startTime]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isTestStarted) {
      setStartTime(new Date());
      setIsTestStarted(true);
    }

    setInputValue(value);

    if (value === text) {
      setEndTime(new Date());
    }
  };

  const handleRestart = () => {
    setInputValue('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setIsTestStarted(false);
    fetchRandomText(); // Fetch a new random text on restart
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`typing-test ${isDarkMode ? 'dark' : ''}`}>
      <button className="toggle-button" onClick={toggleDarkMode}>
        <img src={isDarkMode ? "https://i.postimg.cc/K8qrGfYk/dark-mode.png" : "https://i.postimg.cc/kXyvZq3y/light-mode.png"} alt="Toggle Dark Mode" />
      </button>
      <h1>Typing Speed Test</h1>
      {loading ? (
        <p>Loading text...</p> // Display loading message while fetching
      ) : error ? (
        <p>{error}</p> // Display error message if fetch fails
      ) : (
        <div style={{ width: '100%' }}>
          <p>{text}</p> {/* Display the quote */}
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Start typing the above text..."
            disabled={endTime !== null}
            className={isDarkMode ? 'dark' : ''}
          />
        </div>
      )}
      {endTime && (
        <div>
          <h2>Results</h2>
          <p>Words per minute (WPM): {wpm}</p>
          <button onClick={handleRestart}>Restart Test</button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <TypingTest />
    </div>
  );
}

export default App;
