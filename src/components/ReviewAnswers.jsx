import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./ReviewAnswers.css";

const ReviewAnswers = () => {
    const [reviewData, setReviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract data from router state
    const { state } = location;
    const score = state?.score || null;
    const startTime = state?.startTime || null;
    const endTime = state?.endTime || null;
    const attemptedQuestions = state?.attemptedQuestions || 0;
    const totalQuestions = state?.totalQuestions || 0;
    const subject = state?.subject || "Assessment";

    // Calculate percentage
    const percentage = score !== null ? (score / totalQuestions) * 100 : 0;
    
    useEffect(() => {
        const fetchReviewData = async () => {
            // If we don't have state data, the user might have refreshed the page
            if (!state) {
                setError("Assessment data not available. Please return to dashboard.");
                setIsLoading(false);
                return;
            }

            try {
                // You need to implement this API endpoint to return user's answers with correct options
                const userId = localStorage.getItem("userId");
                const response = await axios.get(`http://localhost:8089/user-responses/review/${userId}`);
                
                if (response.data && Array.isArray(response.data)) {
                    setReviewData(response.data);
                } else {
                    throw new Error("Invalid response data format");
                }
            } catch (err) {
                console.error("Error fetching review data:", err);
                setError("Failed to load review data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewData();
    }, [state]);

    const getStatusClass = (userResponse, correctOption) => {
        if (!userResponse) return "unanswered";
        return userResponse === correctOption ? "correct" : "incorrect";
    };

    if (isLoading) {
        return (
            <div className="review-container loading">
                <h2>Loading Review Data...</h2>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="review-container error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/dashboard")}>Return to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="review-container">
            <div className="review-header">
                <h2>{subject} Assessment Review</h2>
                
                <div className="score-summary">
                    <div className="score-card">
                        <div className="score-value">{score}</div>
                        <div className="score-label">Score</div>
                    </div>
                    
                    <div className="score-details">
                        <div className="score-percentage">
                            <span className="percentage-value">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="score-stats">
                            <div>Attempted: {attemptedQuestions}/{totalQuestions}</div>
                            <div>Correct: {score}/{totalQuestions}</div>
                        </div>
                    </div>
                </div>
                
                <div className="time-details">
                    <div><strong>Started:</strong> {startTime}</div>
                    <div><strong>Completed:</strong> {endTime}</div>
                </div>
            </div>

            <div className="review-content">
                <h3>Question Review</h3>
                
                {reviewData.length > 0 ? (
                    reviewData.map((item, index) => (
                        <div 
                            key={item.questionId || index} 
                            className={`question-review-item ${getStatusClass(item.userResponse, item.correctOption)}`}
                        >
                            <div className="question-number">Question {index + 1}</div>
                            <div className="question-text">{item.questionText}</div>
                            
                            <div className="options-container">
                                {['A', 'B', 'C', 'D'].map(option => (
                                    <div 
                                        key={option} 
                                        className={`option-item ${item.userResponse === option ? 'selected' : ''} ${item.correctOption === option ? 'correct-option' : ''}`}
                                    >
                                        <span className="option-letter">{option}</span>
                                        <span className="option-text">{item[`option${option}`]}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="answer-status">
                                {!item.userResponse && <span className="unanswered-text">Not Answered</span>}
                                {item.userResponse && item.userResponse === item.correctOption && 
                                    <span className="correct-text">Correct</span>
                                }
                                {item.userResponse && item.userResponse !== item.correctOption && 
                                    <span className="incorrect-text">
                                        Incorrect (You selected {item.userResponse}, correct answer is {item.correctOption})
                                    </span>
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No review data available</div>
                )}
            </div>
            
            <div className="review-actions">
                <button onClick={() => navigate("/dashboard")} className="return-button">
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ReviewAnswers;