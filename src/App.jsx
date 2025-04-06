import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Guidelines from "./components/Guidelines";
import AssessmentPage from "./components/AssessmentPage";
import Review from "./components/Review";
import ReviewAnswers from "./components/ReviewAnswers";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root path "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
         <Route element={<ProtectedRoute />}> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/review" element={<Review />} />
        <Route path="/reviewanswers" element={<ReviewAnswers />} />
         </Route> 

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
