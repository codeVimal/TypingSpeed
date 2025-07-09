import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const wordList = [
  "cat", "dog", "sun", "ball", "book", "pen", "red", "blue", "run", "jump",
  "man", "woman", "boy", "girl", "car", "bus", "tree", "bird", "fish", "milk",
  "cup", "hat", "toy", "star", "is", "water", "fire", "day", "night", "food",
  "hand", "eye", "ear", "nose", "leg", "foot", "bed", "box", "home", "farm",
  "rice", "road", "cow", "goat", "frog", "leaf", "rain", "wind", "snow", "rock"
];

const generateWords = (count) => {
  return Array.from({ length: count }, () => wordList[Math.floor(Math.random() * wordList.length)]);
};

const TypingTest = () => {
  const [testDuration, setTestDuration] = useState(60);
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const inputRef = useRef(null);
  const wordBoxRef = useRef(null);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  useEffect(() => {
    const count = testDuration === 30 ? 100 : 200;
    setWords(generateWords(count));
    setInputValue('');
    setTimeLeft(testDuration);
    setWpm(null);
    setAccuracy(null);
    setIsRunning(false);
  }, [testDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishTest();
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRunning]);

  // Scroll every 24 words
  useEffect(() => {
    const wordsTyped = inputValue.trim().split(/\s+/).length;
    if (wordsTyped % 30 === 0 && wordsTyped !== 0) {
      const line = Math.floor(wordsTyped / 30);
      const scrollAmount = line * 48;
      wordBoxRef.current.scrollTo({ top: scrollAmount, behavior: 'smooth' });
    }
  }, [inputValue]);

  // Start timer on first keypress
  useEffect(() => {
    if (!isRunning && inputValue.trim().length > 0) {
      setIsRunning(true);
    }
  }, [inputValue, isRunning]);

  const startTest = () => {
    const count = testDuration === 30 ? 100 : 200;
    setWords(generateWords(count));
    setInputValue('');
    setTimeLeft(testDuration);
    setWpm(null);
    setAccuracy(null);
    setIsRunning(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finishTest = () => {
    setIsRunning(false);
    const inputWords = inputValue.trim().split(/\s+/);
    const correctWords = inputWords.filter((word, idx) => word === words[idx]);
    const minutes = testDuration / 60;
    const typedWordCount = inputWords.filter(word => word !== '').length;
    setWpm(Math.round(typedWordCount / minutes));
    const acc = typedWordCount > 0 ? (correctWords.length / typedWordCount) * 100 : 0;
    setAccuracy(Math.round(acc));
  };

  const renderWords = () => {
    const inputChars = inputValue.split('');
    const fullText = words.join(' ');
    return fullText.split('').map((char, i) => {
      let color = '';
      if (i < inputChars.length) {
        color = inputChars[i] === char ? 'green' : 'red';
      }
      return <span key={i} style={{ color }}>{char}</span>;
    });
  };

  return (
    <div className="App">
      <div className="typing-test-container">
        <h1 id='toptext'>TYPING TEST</h1>
        <button className="toggle-button" onClick={() => setIsDarkMode((prev) => !prev)}>
          <img
            src={isDarkMode
              ? "https://i.postimg.cc/K8qrGfYk/dark-mode.png"
              : "https://i.postimg.cc/kXyvZq3y/light-mode.png"}
            alt="Toggle Mode"
          />
        </button>

        <div className="test-selector">
          <button className={testDuration === 60 ? 'active' : ''} onClick={() => setTestDuration(60)}>60s</button>
          <button className={testDuration === 30 ? 'active' : ''} onClick={() => setTestDuration(30)}>30s</button>
        </div>

        <div className="typing-area" ref={wordBoxRef}>
          <div className="words-display">{renderWords()}</div>
        </div>

        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={timeLeft === 0}
            placeholder="Start typing here..."
          />
          <button className="restart-btn-inline" onClick={startTest}>Restart</button>
        </div>

        <div className="bottom-bar">
          <p>Time Left: {timeLeft}s</p>
          {wpm !== null && (
            <p>WPM: {wpm} | Accuracy: {accuracy}%</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
