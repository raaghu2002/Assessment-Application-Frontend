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
    const {
        score,
        attemptedQuestions,
        totalQuestions,
        startTime,
        endTime
    } = location.state || {
        score: 0,
        attemptedQuestions: 0,
        totalQuestions: 0,
        startTime: "N/A",
        endTime: "N/A",
    };

    return (
        <div className="main-review-container">
            <div className="main-review-card">
                <div className="main-review-content">
                    <div className="main-review-info">
                        <h3>Test Details</h3>
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

                    <div className="main-review-stats">
                        <h3>Test Statistics</h3>
                        <p>
                            <strong>Score:</strong> {score}
                        </p>
                        <p>
                            <strong>Attempted Questions:</strong> {attemptedQuestions}
                        </p>
                        <p>
                            <strong>Total Questions:</strong> {totalQuestions}
                        </p>
                    </div>
                </div>

                <div className="main-review-button-container">
                    <button
                        className="main-review-button"
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
        </div>
    );
};

export default Review;
