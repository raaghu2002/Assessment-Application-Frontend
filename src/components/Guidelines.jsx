import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Guidelines.css";

const Guidelines = () => {
  const navigate = useNavigate(); // Define navigate function

  return (
    <div className="guidelines-section">
      <h3>Assessment Guidelines</h3>
      <ul>
        <li>1. The assessment is 60 minutes long.</li>
        <li>2. You cannot navigate away from the page during the test.</li>
        <li>3. Each question has a time limit.</li>
        <li>4. No external help is allowed.</li>
        <li>5. Once started, the test cannot be paused.</li>
      </ul>
      <button
        onClick={() => navigate("/assessment")} // Use navigate properly
        className="start-assessment-btn"
      >
        Start Assessment
      </button>
    </div>
  );
};

export default Guidelines;
