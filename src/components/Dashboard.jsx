import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import RotatingCircles from "./RotatingCircles";
import Navbar from "./Navbar";

import "./Dashboard.css";

const base_url = process.env.REACT_APP_BASE_URL || "http://localhost:8089";
const Dashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  console.log("Token:", token);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/users/dashboard`,
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
        <Navbar />
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
