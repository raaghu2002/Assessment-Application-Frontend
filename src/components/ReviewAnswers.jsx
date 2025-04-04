import React, { useEffect, useState } from "react";
import "./ReviewAnswers.css";

const ReviewAnswers = () => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    // ✅ Fetch the review answers from local storage
    const storedData = localStorage.getItem("reviewAnswers");
    if (storedData) {
      setReviewData(JSON.parse(storedData));
    } else {
      alert("No review answers available");
    }
  }, []);

  return (
    <div className="review-container">
      <h2 className="review-heading">Review Your Answers</h2>
      <div className="review-content">
        {reviewData.length > 0 ? (
          reviewData.map((question, index) => (
            <div key={index} className="question-box">
              <p>
                <strong>Question {index + 1}:</strong> {question.questionText}
              </p>
              <p className="correct-answer">
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              <p className="explanation">
                <strong>Explanation:</strong> {question.explanation}
              </p>
              <p className="wrong-answers">
                <strong>Wrong Answers:</strong> {question.wrongAnswers}
              </p>
            </div>
          ))
        ) : (
          <p className="loading-message">Loading review answers...</p>
        )}
      </div>
    </div>
  );
};

export default ReviewAnswers;
