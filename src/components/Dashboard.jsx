import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Ensure this file exists
import RotatingCircles from "./RotatingCircles"; // Ensure this file exists

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user data if token exists and is valid
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8089/api/users/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // You can handle token expiry or invalid token case here
        if (error.response && error.response.status === 401) {
          // Redirect to login page or handle token expiry
          navigate("/login");
        }
      }
    };

    if (token) {
      fetchData();
    } else {
      navigate("/login"); // If there's no token, redirect to login page
    }
  }, [token, navigate]);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="dashboard">
      <header>
        <div className="rightContainer">
          <div>
            <img
              src="/images/wizzybox-logo.png"
              alt="Text Image"
              className="transparentTextImage"
            />
          </div>

          <nav className="nav">
            <ul>
              <li>
                <a href="#why">Why WizzyBox</a>
              </li>
              <li>
                <a href="#career">Career</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="bodySection">
        <div className="content">
          <div className="leftContainer">
            <div className="course">
              <button>JAVA FULL STACK</button>
              <button>PYTHON FULL STACK</button>
              <button>MANUAL TESTING</button>
              <button>AUTOMATION TESTING</button>
            </div>

            {userData ? (
              <p>Welcome, {userData.username}!</p>
            ) : (
              <p>Loading user data...</p>
            )}

            <button
              className="ctaButton"
              onClick={() => navigate("/guidelines")}
            >
              Take Assessment ↓
            </button>
          </div>

          <div className="rightContainer">
            <RotatingCircles /> {/* Rotating Circles should be visible here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
