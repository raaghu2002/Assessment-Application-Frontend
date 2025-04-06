import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./ReviewAnswers.css";
const base_url = process.env.REACT_APP_BASE_URL || "http://localhost:8089";

const ReviewAnswers = () => {
    const [reviewData, setReviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attemptedQuestions, setAttemptedQuestions] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [subject, setSubject] = useState("Assessment");

    useEffect(() => {
        const fetchReviewData = async () => {
            // Check if location.state exists
            if (!location.state) {
                setError("Assessment data not available. Please return to dashboard.");
                setIsLoading(false);
                return;
            }

            // Destructure state safely here
            const {
                score = 0,
                startTime = "",
                endTime = "",
                attemptedQuestions = 0,
                totalQuestions = 0,
                subject = "Assessment"
            } = location.state;

            setScore(score);
            setStartTime(startTime);
            setEndTime(endTime);
            setAttemptedQuestions(attemptedQuestions);
            setTotalQuestions(totalQuestions);
            setSubject(subject);

            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.get(`${base_url}/user-responses/review/${userId}`);
                if (Array.isArray(response.data)) {
                    setReviewData(response.data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                setError("Failed to load review data. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewData();
    }, [location.state]);

    const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;

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
            <div className="review-content-wrapper">
                <div className="review-header">
                    <div className="header-content">
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
                                    <div>
                                        <span>Attempted</span>
                                        <span>{attemptedQuestions}/{totalQuestions}</span>
                                    </div>
                                    <div>
                                        <span>Correct</span>
                                        <span>{score}/{totalQuestions}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="time-details">
                            <div>
                                <span><strong>Started</strong></span>
                                <span>{startTime}</span>
                            </div>
                            <div>
                                <span><strong>Completed</strong></span>
                                <span>{endTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="review-actions">
                        <button onClick={() => navigate("/dashboard")} className="return-button">
                            Return to Dashboard
                        </button>
                    </div>
                </div>

                <div className="review-content">
                    <div className="content-inner">
                        <div className="content-header">
                            <h3>Question Review ({reviewData.length} Questions)</h3>
                        </div>
                        {reviewData.length > 0 ? (
                            <div className="questions-list">
                                {reviewData.map((item, index) => (
                                    <div 
                                        key={index} 
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
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">No review data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewAnswers;