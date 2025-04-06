import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
const base_url = process.env.REACT_APP_BASE_URL || "http://localhost:8089";

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
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle keyboard navigation and submissions
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // Show notification instead of alert
  const showNotification = (message, type = "error") => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

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
      setIsLoading(true);
      const response = await axios.post(`${base_url}/api/auth/register`, {
        name,
        email,
      });
      
      showNotification("OTP sent to your email. Please enter OTP to proceed.", "success");
      setIsOtpStep(true);
      setStoredEmail(email);
      setEmail("");
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      showNotification(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      // Use URLSearchParams to properly encode the query parameters
      const params = new URLSearchParams();
      params.append('email', storedEmail);
      params.append('otp', otp);
      params.append('password', password);
      
      const response = await axios.post(
        `${base_url}/api/auth/verify-otp?${params.toString()}`
      );
      
      showNotification("Account created successfully", "success");
      setIsOtpStep(false);
      setIsSignUp(false);
    } catch (error) {
      console.error("OTP verification failed:", error.response?.data);
      showNotification(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      
      const response = await axios.post(
        `${base_url}/api/auth/login?${params.toString()}`
      );
  
      if (response.status === 200) {
        const { name, email, token } = response.data;
        
        if (!token) {
          showNotification("Login failed: No authentication token received");
          return;
        }
  
        localStorage.setItem("userId", email);
        localStorage.setItem("username", name);
        localStorage.setItem("email", email);
        localStorage.setItem("token", token);
  
        // Redirect with success message
        showNotification("Login successful, redirecting to dashboard...", "success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        showNotification("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      showNotification(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showNotification("Please enter your email");
      return;
    }
    
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('email', email);
      
      const response = await axios.post(
        `${base_url}/api/auth/forgot-password?${params.toString()}`
      );
      
      showNotification("OTP sent to your email for password reset.", "success");
      setShowResetForm(true);
      setStoredEmail(email);
    } catch (error) {
      console.error("Failed to send OTP for password reset:", error.response?.data);
      showNotification("Failed to send OTP for password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('email', storedEmail);
      params.append('otp', resetOtp);
      params.append('newPassword', newPassword);
      
      const response = await axios.post(
        `${base_url}/api/auth/reset-password?${params.toString()}`
      );
      
      showNotification("Password reset successful.", "success");
      setShowResetForm(false);
    } catch (error) {
      console.error("Failed to reset password:", error.response?.data);
      showNotification(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (userData) => {
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("username", userData.username);
    
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
      {/* Notification component */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button 
            className="close-notification"
            onClick={() => setNotification({ show: false, message: "", type: "" })}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="form-container sign-up-container">
        {isOtpStep ? (
          <form action="#">
            <h1>Verify OTP</h1>
            <input
              type="email"
              placeholder="Email"
              value={storedEmail}
              readOnly
              className="readonly-field"
            />
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={handleOtpChange}
              onKeyDown={(e) => handleKeyDown(e, handleOtpVerification)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={(e) => handleKeyDown(e, handleOtpVerification)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            <button 
              type="button" 
              onClick={handleOtpVerification}
              disabled={isLoading}
              className={isLoading ? "loading" : ""}
            >
              {isLoading ? "Verifying..." : "Verify OTP & Set Password"}
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
              placeholder="Full Name"
              value={name}
              onChange={handleNameChange}
              onKeyDown={(e) => handleKeyDown(e, handleInitialRegistration)}
              autoFocus
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={(e) => handleKeyDown(e, handleInitialRegistration)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <button 
              type="button" 
              onClick={handleInitialRegistration}
              disabled={isLoading}
              className={isLoading ? "loading" : ""}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
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
              className="readonly-field"
            />
            <input
              type="text"
              placeholder="OTP"
              value={resetOtp}
              onChange={handleResetOtpChange}
              onKeyDown={(e) => handleKeyDown(e, handleResetPassword)}
              autoFocus
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              onKeyDown={(e) => handleKeyDown(e, handleResetPassword)}
            />
            <button 
              type="button" 
              onClick={handleResetPassword}
              disabled={isLoading}
              className={isLoading ? "loading" : ""}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setShowResetForm(false);
              }}
              className="back-link"
            >
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
              onKeyDown={(e) => handleKeyDown(e, handleLogin)}
              autoFocus
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={(e) => handleKeyDown(e, handleLogin)}
            />
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
              className="forgot-password"
            >
              Forgot your password?
            </a>
            <button 
              type="button" 
              onClick={handleLogin}
              disabled={isLoading}
              className={isLoading ? "loading" : ""}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}
      </div>
      
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <img src="/images/wizzybox-logo.png" alt="WizzyBox Logo" className="logo" />
            <h1>Welcome Back!</h1>
            <p>Log in to access your job assessment tools and track your progress.</p>
            <button 
              className="ghost" 
              id="signIn" 
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <img src="/images/wizzybox-logo.png" alt="WizzyBox Logo" className="logo" />
            <h1>Join WizzyBox Today!</h1>
            <p>Sign up to unlock our comprehensive job assessment platform designed to help you grow in your career.</p>
            <button 
              className="ghost" 
              id="signUp" 
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;