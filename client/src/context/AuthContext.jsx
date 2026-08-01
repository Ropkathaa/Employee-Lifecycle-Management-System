import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [candidate, setCandidate] = useState(() => {
    const stored = localStorage.getItem("candidateInfo");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      localStorage.setItem("candidateInfo", JSON.stringify(candidate));
    } else {
      localStorage.removeItem("candidateInfo");
      localStorage.removeItem("candidateToken");
    }
  }, [candidate]);

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/register", payload);
      localStorage.setItem("candidateToken", data.token);
      setCandidate(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed." };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("candidateToken", data.token);
      setCandidate(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCandidate(null);
  };

  return (
    <AuthContext.Provider value={{ candidate, setCandidate, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
