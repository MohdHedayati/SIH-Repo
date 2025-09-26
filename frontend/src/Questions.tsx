import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Questions.css";

// Custom hook for the typewriter effect
const useTypewriter = (text: string, speed = 30) => {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    setDisplayText("");
    if (text) {
      const interval = setInterval(() => {
        setDisplayText((currentText) => {
          if (currentText.length < text.length) {
            return currentText + text.charAt(currentText.length);
          } else {
            clearInterval(interval);
            return currentText;
          }
        });
      }, speed);
      return () => clearInterval(interval);
    }
  }, [text, speed]);
  return displayText;
};

// Updated interface to include the new 'type' property
interface Option {
  id: number;
  option_text: string;
  next_question_id: number | null;
  type?: string; // It's optional
}
interface Question {
  id: number;
  question_text: string;
  chatbot_reply: string;
  options: Option[] | null;
  is_final: boolean;
}

function Questions() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const typedReply = useTypewriter(currentQuestion?.chatbot_reply || "");
  const [inputValue, setInputValue] = useState("");

  const fetchQuestion = (id: number) => {
    setIsLoading(true);
    fetch(`http://localhost:8000/api/question/${id}`)
      .then((res) => { if (!res.ok) { throw new Error("Network response was not ok"); } return res.json(); })
      .then((data: Question) => {
        if (data.is_final) {
          navigate('/results', { state: { recommendation: data, userAnswers } });
        } else {
          setCurrentQuestion(data);
          setIsLoading(false);
        }
      })
      .catch((err) => { setError("Failed to load question. Please try again."); console.error(err); setIsLoading(false); });
  };

  useEffect(() => { fetchQuestion(1); }, []);

  const handleOptionClick = (option: Option, value?: string) => {
    const answerText = option.type === 'input' ? value : option.option_text;
    const answer = { questionId: currentQuestion?.id, questionText: currentQuestion?.question_text, answerId: option.id, answerText };
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    
    if (option.next_question_id) {
        setInputValue("");
        fetchQuestion(option.next_question_id);
    } else {
        // This handles the final step where next_question_id is null
        navigate('/results', { state: { recommendation: currentQuestion, userAnswers: newAnswers } });
    }
  };

  if (isLoading) { return ( <div className="container"><div className="question-card"><h2>Loading...</h2></div></div> ); }
  if (error) { return <h2 style={{ color: "red" }}>{error}</h2>; }
  if (!currentQuestion) { return <h2>No question found.</h2>; }

  return (
    <div className="container">
      <div className="question-card">
        <h1>AI Career Counselor</h1>
        <p className="chatbot-reply">{typedReply}</p>
        <div className="question-text">
          <p dangerouslySetInnerHTML={{ __html: currentQuestion.question_text.replace(/\n/g, '<br />') }} />
        </div>

        {currentQuestion.options && (
          <>
            <div className="options-grid">
              {currentQuestion.options.map((option) =>
                option.type === 'input' ? (
                  <div key={option.id} className="input-option-container">
                    <input
                      type="text"
                      className="text-input-field"
                      placeholder={option.option_text}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputValue.trim()) {
                          handleOptionClick(option, inputValue);
                        }
                      }}
                    />
                    <button 
                      className="input-submit-button" 
                      onClick={() => {
                        if (inputValue.trim()) {
                          handleOptionClick(option, inputValue);
                        }
                      }}
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <button
                    key={option.id}
                    className="option-button"
                    onClick={() => handleOptionClick(option)}
                  >
                    <span className="option-text">{option.option_text}</span>
                    <span className="view-more-link">View More</span>
                  </button>
                )
              )}
            </div>
            
            {/* --- THIS IS THE MISSING TEXTBOX --- */}
            <div className="extra-thoughts-container">
              <textarea placeholder="Feel free to share any other thoughts here... (optional)" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Questions;