import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await fetch("/api/auth/validate-token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Token validation failed", error);
                setIsAuthenticated(false);
            }
        };

        validateToken();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>;
};

export default ProtectedRoute;
