import React, { useState, useEffect } from "react";
import "./Questions.css";

// Define the structure of a Question and an Option
interface Option {
  id: number;
  option_text: string;
  next_question_id: number | null;
}

interface Question {
  id: number;
  question_text: string;
  chatbot_reply: string;
  options: Option[] | null;
  is_final: boolean;
}

function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  // Function to fetch a question by its ID
  const fetchQuestion = (id: number) => {
    setIsLoading(true);
    fetch(`http://localhost:8000/api/question/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data: Question) => {
        setCurrentQuestion(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to load question. Please try again.");
        console.error(err);
        setIsLoading(false);
      });
  };

  // Fetch the very first question when the page loads
  useEffect(() => {
    fetchQuestion(1);
  }, []);

  // Function to handle when a user clicks an option
  const handleOptionClick = (option: Option) => {
    // Save the user's choice
    const answer = {
      questionId: currentQuestion?.id,
      questionText: currentQuestion?.question_text,
      answerId: option.id,
      answerText: option.option_text,
    };
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    // Move to the next question
    if (option.next_question_id) {
      fetchQuestion(option.next_question_id);
    }
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return <h2>Loading questions...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red" }}>{error}</h2>;
  }

  if (!currentQuestion) {
    return <h2>No question found.</h2>;
  }

  return (
    <div className="container">
      <div className="question-card">
        <h1>AI Career Counselor</h1>
        <p className="chatbot-reply">{currentQuestion.chatbot_reply}</p>
        <div className="question-text">
          {/* Using dangerouslySetInnerHTML to render markdown like ### and ** */}
          <p dangerouslySetInnerHTML={{ __html: currentQuestion.question_text.replace(/\n/g, '<br />') }} />
        </div>

        {/* If it's the final question, don't show options */}
        {!currentQuestion.is_final && currentQuestion.options && (
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                className="option-button"
                onClick={() => handleOptionClick(option)}
              >
                {option.option_text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Questions;