import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'; // Ensure axios is installed
import "./Guidelines.css";
const base_url = process.env.REACT_APP_BASE_URL || "http://localhost:8089";

const Guidelines = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasAttended, setHasAttended] = useState(false);

    // Extract subject from query parameters
    const queryParams = new URLSearchParams(location.search);
    const subject = queryParams.get("subject") || "JAVA FULL STACK";

    // Check authentication when component mounts
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");

        console.log("Guidelines: useEffect - userId:", userId, "username:", username);  // Debugging log

        if (userId && username) {
            setIsAuthenticated(true);
            checkIfUserHasAttendedAssessment(userId, subject);
        } else {
            // Store the intended destination before redirecting
            sessionStorage.setItem("redirectAfterLogin", location.pathname + location.search);
            navigate("/login");
        }
    }, [navigate, location.pathname, location.search]);

    const checkIfUserHasAttendedAssessment = async (userId, subject) => {
        try {
            const response = await axios.get(`${base_url}/user-responses/has-attended/${userId}/${subject}`);
            
            if (response.status === 200) {
                setHasAttended(response.data);
            } else {
                console.error("Failed to check if user has attended assessment:", response);
            }
        } catch (error) {
            console.error("Error checking if user has attended assessment:", error);
            setHasAttended(false); // Default to false if an error occurs
        }
    };
    

    const handleStartAssessment = () => {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");

        console.log("Guidelines: handleStartAssessment - userId:", userId, "username:", username);  // Debugging log

        if (userId && username) {
            // Pass the subject to the assessment page
            console.log("Guidelines: Navigating to", `/assessment?subject=${encodeURIComponent(subject)}`);  // Debugging log
            navigate(`/assessment?subject=${encodeURIComponent(subject)}`);
        } else {
            // If somehow the authentication state changed, redirect to login
            sessionStorage.setItem("redirectAfterLogin", `/assessment?subject=${encodeURIComponent(subject)}`);
            navigate("/login");
        }
    };

    // Don't render anything until authentication check completes
    if (!isAuthenticated) {
        console.log("Guidelines: Not authenticated - rendering null");  // Debugging log
        return null;
    }

    console.log("Guidelines: Authenticated - rendering Guidelines component");  // Debugging log

    return (
        <div className="guidelines-container">
            <div className="guidelines-card">
                <h2>{subject} Assessment</h2>
                <h3>Assessment Guidelines</h3>

                <div className="guidelines-content">
                    <ul>
                        <li>The assessment is 60 minutes long.</li>
                        <li>You cannot navigate away from the page during the test.</li>
                        <li>You can review and change your answers before final submission.</li>
                        <li>Each question has equal weightage.</li>
                        <li>No external help or resources are allowed.</li>
                        <li>Once started, the test cannot be paused.</li>
                    </ul>

                    <div className="guidelines-info">
                        <p><strong>Subject:</strong> {subject}</p>
                        <p><strong>Duration:</strong> 60 minutes</p>
                        <p><strong>Questions:</strong> Multiple choice</p>
                    </div>
                </div>

                {hasAttended ? (
                    <button
                        className="start-assessment-btn disabled"
                        disabled
                    >
                        Assessment Already Attended
                    </button>
                ) : (
                    <button
                        onClick={handleStartAssessment}
                        className="start-assessment-btn"
                    >
                        Start Assessment
                    </button>
                )}
            </div>
        </div>
    );
};

export default Guidelines;
