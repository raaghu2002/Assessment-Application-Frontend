import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Assessment.css";

function AssessmentPage() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 Hour in seconds
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [score, setScore] = useState(null); // Add this state for storing score

  const navigate = useNavigate();

  useEffect(() => {
    const currentStartTime = new Date().toLocaleString(); // Capture real-time
    setStartTime(currentStartTime);

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("username");

    if (!userId || !userName) {
      console.error("User information is missing. Please log in again.");
      return;
    }

    axios
      .get("http://localhost:8080/api/questions")
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          console.log("No questions available!");
          return;
        }

        setQuestions(response.data);

        const initialResponses = response.data.map((question) => ({
          questionId: question.questionId,
          userId,
          userName,
          userResponse: null,
        }));

        setResponses(initialResponses);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
      const currentEndTime = new Date().toLocaleString(); // Capture real-time on submit

      // Transform responses into required format, ensuring null for unanswered questions
      const formattedResponses = responses.map((response) => ({
        question: { questionId: response.questionId }, // Wrap questionId in a "question" object
        userId: response.userId,
        userResponse: response.userResponse || null, // Send null if userResponse is empty
        username: response.userName,
      }));

      console.log("Submitting Responses:", formattedResponses);

      // Calculate attempted and total questions
      const attemptedQuestions = responses.filter(
        (response) =>
          response.userResponse !== null && response.userResponse !== undefined
      ).length;
      const totalQuestions = responses.length;

      // Allow submission at any time, even with unanswered questions
      const response = await axios.post(
        "http://localhost:8080/user-responses/submit",
        formattedResponses
      );

      if (response.data !== undefined) {
        setScore(response.data); // Assuming setScore updates the score state
        console.log("Score received from backend:", response.data);
        alert(`Your score is: ${response.data}`);

        // Navigate to Review Page with score, attempted questions, and total questions
        navigate("/review", {
          state: {
            score: response.data,
            attemptedQuestions: attemptedQuestions,
            totalQuestions: totalQuestions,
            startTime,
            endTime: currentEndTime,
          },
        });
      } else {
        console.error("No score received from backend.");
        alert("Error: No score received from backend.");
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
      alert("Failed to submit responses. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        height: "100vh",
      }}
    >
      {/* Left Container (70%) - Question Display */}
      <div
        style={{
          flex: "7",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginRight: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {questions.length > 0 && (
          <div key={questions[currentQuestionIndex].questionId}>
            <h4>
              {questions[currentQuestionIndex].questionId}.{" "}
              {questions[currentQuestionIndex].questionText}
            </h4>
            <div>
              {["A", "B", "C", "D"].map((optionKey) => {
                const optionValue =
                  questions[currentQuestionIndex][`option${optionKey}`];
                const isSelected =
                  responses.find(
                    (res) =>
                      res.questionId ===
                        questions[currentQuestionIndex].questionId &&
                      res.userResponse === optionKey
                  )?.userResponse === optionKey;

                return (
                  <div
                    key={optionKey}
                    onClick={() => handleOptionClick(optionKey)}
                    style={{
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      backgroundColor: isSelected ? "lightgreen" : "#f0f0f0",
                      cursor: "pointer",
                      transition: "0.3s",
                      border: isSelected ? "2px solid green" : "1px solid #ccc",
                    }}
                  >
                    <strong>{optionKey}.</strong> {optionValue}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons placed 100px below the options */}
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() =>
              setCurrentQuestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
              )
            }
            disabled={currentQuestionIndex === 0}
            style={{
              padding: "10px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
            }}
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
            style={{
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor:
                currentQuestionIndex === questions.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right Container (30%) - Timer & Question Grid */}
      <div
        style={{
          flex: "3",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxHeight: "500px",
          overflowY: "auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* Timer */}
        <h2 style={{ marginBottom: "40px" }}>
          Time Left: {formatTime(timeLeft)}
        </h2>

        <h3>Questions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
            gap: "10px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {questions.map((question, index) => {
            const isAnswered = responses.find(
              (res) =>
                res.questionId === question.questionId && res.userResponse
            );

            return (
              <button
                key={question.questionId}
                onClick={() => setCurrentQuestionIndex(index)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: isAnswered
                    ? "green"
                    : currentQuestionIndex === index
                    ? "lightblue"
                    : "#ddd",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                {question.questionId}
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AssessmentPage;
