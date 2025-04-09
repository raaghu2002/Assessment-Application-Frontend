import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Assessment.css";

const base_url = process.env.REACT_APP_BASE_URL || "http://localhost:8089";

function AssessmentPage() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 Hour in seconds
  const [startTime, setStartTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract subject from query parameters
  const queryParams = new URLSearchParams(location.search);
  const subject = queryParams.get("subject") || "JAVA FULL STACK";

  // Fetch questions on component mount
  useEffect(() => {
    const currentStartTime = new Date().toLocaleString();
    setStartTime(currentStartTime);

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("username");

    if (!userId || !userName) {
      setError("User information is missing. Please log in again.");
      return;
    }

    setIsLoading(true);
    axios
      .get(`${base_url}/api/questions/get?subject=${subject}`)
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          setError("No questions available for this subject!");
          return;
        }

        setQuestions(response.data);
        setResponses(
          response.data.map((question) => ({
            questionId: question.questionId,
            userId,
            userName,
            userResponse: null,
          }))
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setError(`Failed to load questions: ${error.message}`);
        setIsLoading(false);
      });
  }, [subject]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionClick = (optionKey) => {
    setResponses((prevResponses) =>
      prevResponses.map((response) =>
        response.questionId === questions[currentQuestionIndex].questionId
          ? { ...response, userResponse: optionKey }
          : response
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const currentEndTime = new Date().toLocaleString();

      // Transform responses into required format
      const formattedResponses = responses.map((response) => ({
        question: { questionId: response.questionId },
        userId: response.userId,
        userResponse: response.userResponse || null,
        username: response.userName,
      }));

      console.log("Submitting Responses:", formattedResponses);

      // Calculate attempted and total questions
      const attemptedQuestions = responses.filter(
        (response) => response.userResponse !== null
      ).length;
      const totalQuestions = responses.length;

      const response = await axios.post(
        `${base_url}/user-responses/submit`,
        formattedResponses
      );

      if (response.data !== undefined) {
        const score = response.data;
        console.log("Score received from backend:", score);
        
        // Navigate to Review Page with score and stats
        navigate("/review", {
          state: {
            score,
            attemptedQuestions,
            totalQuestions,
            startTime,
            endTime: currentEndTime,
            subject
          },
        });
      } else {
        throw new Error("No score received from backend");
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
      alert("User Already Submitted This Assessment.");
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="loading-container">
        <h2>Loading assessment questions...</h2>
        <p>Please wait while we prepare your {subject} assessment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/dashboard")}>Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      {/* Header with subject and timer */}
      <header className="assessment-header">
        <h2>{subject} Assessment</h2>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </header>
      
      <div className="assessment-content">
        {/* Left Container - Question Display */}
        <div className="question-container">
          {questions.length > 0 && (
            <div className="question-box">
              <h4 className="question-text">
                {currentQuestionIndex + 1}. {questions[currentQuestionIndex].questionText}
              </h4>
              <div className="options-list">
                {["A", "B", "C", "D"].map((optionKey) => {
                  const optionValue =
                    questions[currentQuestionIndex][`option${optionKey}`];
                  const isSelected =
                    responses.find(
                      (res) =>
                        res.questionId === questions[currentQuestionIndex].questionId &&
                        res.userResponse === optionKey
                    )?.userResponse === optionKey;

                  return (
                    <div
                      key={optionKey}
                      onClick={() => handleOptionClick(optionKey)}
                      className={`option-item ${isSelected ? "selected" : ""}`}
                    >
                      <strong>{optionKey}.</strong> {optionValue}
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="navigation-buttons">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prevIndex) =>
                      prevIndex > 0 ? prevIndex - 1 : prevIndex
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                  className="prev-button"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prevIndex) =>
                      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
                    )
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="next-button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Container - Question Grid */}
        <div className="question-grid-container">
          <h3>Questions</h3>
          <div className="question-grid">
            {questions.map((question, index) => {
              const isAnswered = responses.find(
                (res) =>
                  res.questionId === question.questionId && res.userResponse
              );

              return (
                <button
                  key={question.questionId}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`question-button ${
                    isAnswered ? "answered" : ""
                  } ${currentQuestionIndex === index ? "current" : ""}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} className="submit-button">
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPage;