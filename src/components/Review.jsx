import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Review.css";

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fetching data from localStorage
  const userId = localStorage.getItem("userId") || "N/A";
  const username = localStorage.getItem("username") || "N/A";

  // Receiving values from the previous page via state
  const { score, attemptedQuestions, totalQuestions, startTime, endTime } =
    location.state || {
      score: 0,
      attemptedQuestions: 0,
      totalQuestions: 0,
      startTime: "N/A",
      endTime: "N/A",
    };

  return (
    <div className="main">
      <div className="head">
        <div className="left">
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          <p>
            <strong>Start Time:</strong> {startTime}
          </p>
          <p>
            <strong>Completed Time:</strong> {endTime}
          </p>
        </div>

        <div className="right">
          <p>
            <strong>Score:</strong> {score}
          </p>
          <p>
            <strong>Attempted Questions:</strong> {attemptedQuestions}
          </p>
          <p>
            <strong>Total Questions:</strong> {totalQuestions}
          </p>
          <p></p>
        </div>
      </div>

      <div className="review-button">
        <button
          onClick={() =>
            navigate("/reviewanswers", {
              state: {
                score,
                attemptedQuestions,
                totalQuestions,
                startTime,
                endTime,
              },
            })
          }
        >
          Review Answers
        </button>
      </div>
    </div>
  );
};

export default Review;
