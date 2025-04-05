import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("token");
            console.log("Token before validation:", token); // Debugging

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:8089/api/auth/validate-token", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                console.log("Token validation response:", response.data); // Debugging
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Token validation error:", error.response?.data || error.message);
                setIsAuthenticated(false);
                localStorage.removeItem("token"); // Clear invalid token
            }
        };

        validateToken();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // Prevents flashing redirects
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
