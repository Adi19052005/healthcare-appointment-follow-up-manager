import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");

      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }

    setLoading(false);
  }

  async function login(email, password) {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      toast.success("Logged in successfully.");

      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed."
      );
      throw err;
    }
  }

  async function register(payload) {
    try {
      const { data } = await api.post(
        "/auth/register",
        payload
      );

      toast.success("Registration successful.");

      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed."
      );
      throw err;
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {}

    localStorage.clear();

    setUser(null);

    toast.success("Logged out.");
  }

  const value = useMemo(
    () => ({
      user,
      loading,

      login,
      register,
      logout,

      isAuthenticated: !!user,

      isAdmin: user?.role === "ADMIN",
      isDoctor: user?.role === "DOCTOR",
      isPatient: user?.role === "PATIENT",
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}