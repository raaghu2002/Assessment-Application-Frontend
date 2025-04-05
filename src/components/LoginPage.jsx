import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleResetOtpChange = (e) => {
    setResetOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) && !isOtpStep) {
      newErrors.email = "Invalid email address.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (isOtpStep && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-12 characters with uppercase, lowercase, number, and special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialRegistration = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post("http://localhost:8089/api/auth/register", {
        name,
        email,
      });
      alert("OTP sent to your email. Please enter OTP to proceed.");
      setIsOtpStep(true);
      setStoredEmail(email);
      setEmail("");
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      alert("Registration failed");
    }
  };

  const handleOtpVerification = async () => {
    if (!validateForm()) return;
    try {
      // Use URLSearchParams to properly encode the query parameters
      const params = new URLSearchParams();
      params.append('email', storedEmail);
      params.append('otp', otp);
      params.append('password', password);
      
      const response = await axios.post(
        `http://localhost:8089/api/auth/verify-otp?${params.toString()}`
      );
      
      console.log("OTP verification response:", response.data);
      alert("Account created successfully");
      setIsOtpStep(false);
      setIsSignUp(false);
    } catch (error) {
      console.error("OTP verification failed:", error.response?.data);
      alert(`OTP verification failed: ${error.response?.data || error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      console.log("Attempting login with:", email, password);
      
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      
      console.log("Request URL:", `http://localhost:8089/api/auth/login?${params.toString()}`);
      
      const response = await axios.post(
        `http://localhost:8089/api/auth/login?${params.toString()}`
      );
  
      console.log("Login response:", response);
      console.log("Login response data:", response.data);
  
      if (response.status === 200) {
        const { name, email, token } = response.data;
        
        if (!token) {
          console.error("No token received in response");
          alert("Login failed: No authentication token received");
          return;
        }
  
        console.log("Setting localStorage values:", name, email, token);
        localStorage.setItem("userId", email);
        localStorage.setItem("username", name);
        localStorage.setItem("email", email);
        localStorage.setItem("token", token);
  
        console.log("Navigating to dashboard");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      alert(error.response?.data || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Use URLSearchParams to properly encode the query parameters
      const params = new URLSearchParams();
      params.append('email', email);
      
      const response = await axios.post(
        `http://localhost:8089/api/auth/forgot-password?${params.toString()}`
      );
      
      alert("OTP sent to your email for password reset.");
      setShowResetForm(true);
      setStoredEmail(email);
    } catch (error) {
      console.error("Failed to send OTP for password reset:", error.response?.data);
      alert("Failed to send OTP for password reset.");
    }
  };

  const handleResetPassword = async () => {
    try {
      // Use URLSearchParams to properly encode the query parameters
      const params = new URLSearchParams();
      params.append('email', storedEmail);
      params.append('otp', resetOtp);
      params.append('newPassword', newPassword);
      
      const response = await axios.post(
        `http://localhost:8089/api/auth/reset-password?${params.toString()}`
      );
      
      alert("Password reset successful.");
      setShowResetForm(false);
    } catch (error) {
      console.error("Failed to reset password:", error.response?.data);
      alert(`Failed to reset password: ${error.response?.data || error.message}`);
    }
  };

  // In your Login component, after successful login:
const handleSuccessfulLogin = (userData) => {
  // Store user data in localStorage
  localStorage.setItem("userId", userData.userId);
  localStorage.setItem("username", userData.username);
  
  // Check if there's a redirect path stored
  const redirectPath = sessionStorage.getItem("redirectAfterLogin");
  
  if (redirectPath) {
    // Clear the stored path
    sessionStorage.removeItem("redirectAfterLogin");
    // Navigate to the stored path
    navigate(redirectPath);
  } else {
    // Default navigation if no stored path
    navigate("/dashboard");
  }
};

  return (
    <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
      <div className="form-container sign-up-container">
        {isOtpStep ? (
          <form action="#">
            <h1>Verify OTP and Set Password</h1>
            <input
              type="email"
              placeholder="Email"
              value={storedEmail}
              readOnly
            />
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={handleOtpChange}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            <button type="button" onClick={handleOtpVerification}>
              Verify OTP and Set Password
            </button>
          </form>
        ) : (
          <form action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <button type="button" onClick={handleInitialRegistration}>
              Send OTP
            </button>
          </form>
        )}
      </div>
      <div className="form-container sign-in-container">
        {showResetForm ? (
          <form action="#">
            <h1>Reset Password</h1>
            <input
              type="email"
              placeholder="Email"
              value={storedEmail}
              readOnly
            />
            <input
              type="text"
              placeholder="OTP"
              value={resetOtp}
              onChange={handleResetOtpChange}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <button type="button" onClick={handleResetPassword}>
              Reset Password
            </button>
            <a href="#" onClick={() => setShowResetForm(false)}>
              Back to login
            </a>
          </form>
        ) : (
          <form action="#">
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <a href="#" onClick={handleForgotPassword}>
              Forgot your password?
            </a>
            <button type="button" onClick={handleLogin}>
              Sign In
            </button>
          </form>
        )}
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <img src="/images/wizzybox-logo.png" alt="WizzyBox Logo" className="logo" />
            <h1>Welcome Back to WizzyBox!</h1>
            <p>Log in to access your job assessment tools and track your progress.</p>
            <button className="ghost" id="signIn" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <img src="/images/wizzybox-logo.png" alt="WizzyBox Logo" className="logo" />
            <h1>Join WizzyBox Today!</h1>
            <p>Sign up to unlock a comprehensive job assessment platform designed to help you grow in your career.</p>
            <button className="ghost" id="signUp" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;