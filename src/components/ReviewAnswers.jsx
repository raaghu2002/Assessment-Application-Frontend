import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
            if (!location.state) {
                setError("Assessment data not available. Please return to dashboard.");
                setIsLoading(false);
                return;
            }

            const {
                score = 0,
                startTime = "",
                endTime = "",
                attemptedQuestions = 0,
                totalQuestions = 0,
                subject = "Assessment",
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
        if (!userResponse) return "border-gray";
        return userResponse === correctOption ? "border-green" : "border-red";
    };

    if (isLoading) {
        return (
            <div className="centered">
                <h2>Loading Review Data...</h2>
                <div className="spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="centered">
                <h2 className="error-title">Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/dashboard")} className="btn">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="review-wrapper">
            <div className="review-header">
                <h2>{subject} Assessment Review</h2>
                <div className="summary">
                    <div className="score-box">
                        <div className="score">{score}</div>
                        <div className="label">Score</div>
                    </div>
                    <div className="stats">
                        <div className="percent">{percentage.toFixed(1)}%</div>
                        <div>Attempted: {attemptedQuestions}/{totalQuestions}</div>
                        <div>Correct: {score}/{totalQuestions}</div>
                    </div>
                    <div className="timing">
                        <div><strong>Started:</strong> {startTime}</div>
                        <div><strong>Completed:</strong> {endTime}</div>
                    </div>
                    <button onClick={() => navigate("/dashboard")} className="btn">
                        Return to Dashboard
                    </button>
                </div>
            </div>

            <div className="review-body">
                <h3>Question Review ({reviewData.length} Questions)</h3>
                {reviewData.length > 0 ? (
                    <div className="questions">
                        {reviewData.map((item, index) => (
                            <div key={index} className={`question-card ${getStatusClass(item.userResponse, item.correctOption)}`}>
                                <div className="question-number">Question {index + 1}</div>
                                <div className="question-text">{item.questionText}</div>

                                <div className="options">
                                    {["A", "B", "C", "D"].map((option) => (
                                        <div
                                            key={option}
                                            className={`option ${item.correctOption === option ? "correct" : ""} ${item.userResponse === option && item.correctOption !== option ? "incorrect" : ""}`}
                                        >
                                            <span className="option-label">{option}</span>
                                            <span>{item[`option${option}`]}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="status">
                                    {!item.userResponse && <span className="gray">Not Answered</span>}
                                    {item.userResponse === item.correctOption && <span className="green">Correct</span>}
                                    {item.userResponse && item.userResponse !== item.correctOption && (
                                        <span className="red">
                                            Incorrect (You selected {item.userResponse}, correct is {item.correctOption})
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">No review data available</div>
                )}
            </div>
        </div>
    );
};

export default ReviewAnswers;
