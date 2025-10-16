"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Program {
  _id: string;
  title: string;
  description: string;
  pricing: {
    currency: string;
    tuition: number;
  };
  duration: string;
  mode: string;
  image: string;
}

interface ProgramContextType {
  program: Program | null;
  loading: boolean;
  error: string | null;
  fetchProgram: (programId: string) => Promise<void>;
  clearError: () => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};

export const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgram = useCallback(async (programId: string) => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, use mock data
      // In production, you would fetch from your API
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setProgram({
        _id: programId,
        title: "Global Banking & Finance Fellowship",
        description:
          "A comprehensive fellowship program in banking and finance.",
        pricing: {
          currency: "INR",
          tuition: 100000,
        },
        duration: "2 Weeks",
        mode: "Online",
        image: "/images/fellowship.jpg",
      });
    } catch (err) {
      setError("Failed to load program details");
      console.error("Error fetching program:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    program,
    loading,
    error,
    fetchProgram,
    clearError,
  };

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
};

