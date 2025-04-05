import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import RotatingCircles from "./RotatingCircles";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8089/api/users/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    if (token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  // Navigate to guidelines page with selected subject
  const handleSubjectClick = (subject) => {
    navigate(`/guidelines?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div className="dashboard">
      <header>
        <div className="rightContainer">
          <img
            src="/images/wizzybox-logo.png"
            alt="Text Image"
            className="transparentTextImage"
          />
          <nav className="nav">
            <ul>
              <li><a href="#why">Why WizzyBox</a></li>
              <li><a href="#career">Career</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="bodySection">
        <div className="content">
          <div className="leftContainer">
            <div className="course">
              <button onClick={() => handleSubjectClick("JAVA FULL STACK")}>
                JAVA FULL STACK
              </button>
              <button onClick={() => handleSubjectClick("PYTHON FULL STACK")}>
                PYTHON FULL STACK
              </button>
              <button onClick={() => handleSubjectClick("MANUAL TESTING")}>
                MANUAL TESTING
              </button>
              <button onClick={() => handleSubjectClick("AUTOMATION TESTING")}>
                AUTOMATION TESTING
              </button>
            </div>

            
          </div>

          <div className="rightContainer">
            <RotatingCircles />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
