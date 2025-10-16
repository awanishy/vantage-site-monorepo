import { useState, useCallback } from "react";

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

export const useProgram = () => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgram = useCallback(async (programId: string) => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, use mock data
      // In production, you would fetch from your API: `/api/programs/${programId}`
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

  return {
    program,
    loading,
    error,
    fetchProgram,
    clearError,
  };
};

