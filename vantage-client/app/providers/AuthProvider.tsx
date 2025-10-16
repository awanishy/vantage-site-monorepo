"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType?: string;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("authToken");
    if (t) {
      fetchUserProfile(t);
    } else setIsLoading(false);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`/api/users/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json();
        // Backend returns: { success: true, user: {...} }
        // Frontend API wraps it as: { success: true, data: { user: {...} } }
        const userData =
          responseData.user || responseData.data?.user || responseData.data;

        if (userData) {
          setUser(userData);
        } else {
          console.error("No user data in response:", responseData);
          localStorage.removeItem("authToken");
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token || data.data?.token;

        localStorage.setItem("authToken", token);
        await fetchUserProfile(token);
        return true;
      }

      // Handle specific error cases
      if (data.requiresVerification) {
        // Throw error with email for verification redirect
        throw new Error(
          JSON.stringify({
            requiresVerification: true,
            email: data.email || email,
            message: data.error || data.message,
          })
        );
      }

      // Generic error
      throw new Error(data.error || data.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const resp = await fetch(`/api/users/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!resp.ok) return false;
      return true;
    } catch (e) {
      console.error("Signup error:", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
