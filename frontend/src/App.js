import React, { useState } from "react";
import "./App.css"; 

function App() {
  const questions = [
    "What is your name?",
    "How old are you?",
    "What is your favorite color?",
    "What city do you live in?",
    "What is your favorite food?",
    "What is your hobby?",
    "What is your dream job?",
    "What is your favorite animal?",
    "What is your favorite movie?",
    "What is your favorite programming language?"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleChange = (e) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: answers[0] || "Anonymous",
          question: "All Questions",
          answer: JSON.stringify(answers),
          correct: true
        })
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Quiz finished! Answers saved.");
          console.log(data);
        });
    }
  };

  return (
    <div className="container">
      <h1>Career Quiz</h1>
      <h2>
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <p>{questions[currentIndex]}</p>
      <input
        type="text"
        value={answers[currentIndex]}
        onChange={handleChange}
        placeholder="Type your answer"
      />
      <br />
      <button onClick={handleNext}>
        {currentIndex === questions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}

export default App;
