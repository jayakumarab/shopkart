import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Logout action
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // Fetch current user details if token is valid on boot
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const profile = await authAPI.getMe();
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();

    // Listen for unauthorized events from api interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      const accessToken = data.access_token;
      const userData = data.user;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const newUser = await authAPI.register({ name, email, password });
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

