import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("crop_advisor_token"));
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage or API on initial mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("crop_advisor_token");
      if (storedToken) {
        try {
          setToken(storedToken);
          const profileData = await authService.getProfile();
          setUser(profileData.user);
        } catch (err) {
          console.error("Token validation failed on boot:", err);
          // Token is invalid/expired
          localStorage.removeItem("crop_advisor_token");
          localStorage.removeItem("crop_advisor_user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("crop_advisor_token", data.token);
      localStorage.setItem("crop_advisor_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("crop_advisor_token");
    localStorage.removeItem("crop_advisor_user");
    setToken(null);
    setUser(null);
  };

  const loginWithToken = async (tokenString) => {
    setLoading(true);
    try {
      localStorage.setItem("crop_advisor_token", tokenString);
      setToken(tokenString);
      const profileData = await authService.getProfile();
      localStorage.setItem("crop_advisor_user", JSON.stringify(profileData.user));
      setUser(profileData.user);
      return profileData.user;
    } catch (err) {
      console.error("Failed Google login validation:", err);
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
