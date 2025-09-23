import React, { useState, useEffect } from "react";
import "./Questions.css";

function Questions() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.map((q: any) => q.text || q));
        setAnswers(Array(data.length).fill(""));
      })
      .catch(() => setQuestions([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // send answers to backend
      fetch("http://localhost:8000/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: sessionStorage.getItem("user")
            ? JSON.parse(sessionStorage.getItem("user")!).user
            : "Anonymous",
          answers,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Quiz finished! Answers saved (in memory).");
        })
        .catch(() => alert("Failed to save answers."));
    }
  };

  if (questions.length === 0) return <h2>Loading questions...</h2>;

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

export default Questions;
