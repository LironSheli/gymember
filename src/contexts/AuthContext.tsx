import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearError = () => setError("");

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("gymember_token");
        console.log("getToken: Retrieved token from localStorage:", !!token);
        return token;
      } catch (error) {
        console.error("getToken: Error accessing localStorage:", error);
        return null;
      }
    }
    return null;
  };

  // Set token in localStorage
  const setToken = (token: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gymember_token", token);
        console.log("setToken: Token saved to localStorage successfully");
      } catch (error) {
        console.error("setToken: Error saving to localStorage:", error);
      }
    }
  };

  // Remove token from localStorage
  const removeToken = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("gymember_token");
        console.log("removeToken: Token removed from localStorage");
      } catch (error) {
        console.error("removeToken: Error removing from localStorage:", error);
      }
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const token = getToken();
      console.log("Checking auth, token exists:", !!token);
      console.log(
        "Token value:",
        token ? token.substring(0, 20) + "..." : "null"
      );

      if (!token) {
        console.log("No token found, setting loading to false");
        setLoading(false);
        setUser(null);
        return;
      }

      console.log("Making request to /api/auth/me");
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Auth check response status:", response.status);
      console.log(
        "Auth check response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful, user:", data.user);
        setUser(data.user);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("Auth check failed, error:", errorData);
        // Token is invalid, remove it
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    console.log("AuthContext: useEffect triggered, checking auth");
    checkAuth();
  }, [checkAuth]);

  const signIn = async (email: string, password: string) => {
    try {
      setError("");
      console.log("Signing in with email:", email);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response status:", response.status);
      console.log("Login response data:", {
        ...data,
        token: data.token ? data.token.substring(0, 20) + "..." : "null",
      });

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token to localStorage
      console.log("Saving token to localStorage");
      setToken(data.token);
      console.log("Setting user in state:", data.user);
      setUser(data.user);
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError("");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Save token to localStorage
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Remove token from localStorage
      removeToken();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      setError("");
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Password reset failed");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Password reset failed"
      );
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
