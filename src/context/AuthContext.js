"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "@/utility/config";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch current authenticated session from server
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/auth/auth_me");
      if (response.data?.success && response.data?.data?.user) {
        const fetchedUser = response.data.data.user;
        setUser(fetchedUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("biddyasetu_user", JSON.stringify(fetchedUser));
        }
      }
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        setToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("biddyasetu_token");
          localStorage.removeItem("biddyasetu_user");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Restore cached session on client mount
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("biddyasetu_token");
      const storedUser = localStorage.getItem("biddyasetu_user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // ignore error
        }
      }
    }
    checkAuth();
  }, [checkAuth]);

  /**
   * Refresh current user data from server (Memoized)
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/auth_me");
      if (response.data?.success && response.data?.data?.user) {
        const fetchedUser = response.data.data.user;
        setUser(fetchedUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("biddyasetu_user", JSON.stringify(fetchedUser));
        }
        return fetchedUser;
      }
    } catch (err) {
      console.warn("Failed to refresh user:", err.message);
    }
    return null;
  }, []);

  /**
   * Login user with Phone/Email and Password
   */
  const login = useCallback(async ({ identifier, password }) => {
    const response = await api.post("/auth/login", {
      identifier,
      password,
    });

    const { user: loggedInUser, token: receivedToken } = response.data.data;

    setUser(loggedInUser);
    setToken(receivedToken);

    if (typeof window !== "undefined") {
      localStorage.setItem("biddyasetu_token", receivedToken);
      localStorage.setItem("biddyasetu_user", JSON.stringify(loggedInUser));
    }

    return { success: true, user: loggedInUser, message: response.data.message };
  }, []);

  /**
   * Register new member account
   */
  const register = useCallback(async (formData) => {
    const response = await api.post("/auth/register", formData);

    const { user: newUser, token: receivedToken } = response.data.data;

    setUser(newUser);
    setToken(receivedToken);

    if (typeof window !== "undefined") {
      localStorage.setItem("biddyasetu_token", receivedToken);
      localStorage.setItem("biddyasetu_user", JSON.stringify(newUser));
    }

    return { success: true, user: newUser, message: response.data.message };
  }, []);

  /**
   * Logout user from session
   */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout endpoint error:", error);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("biddyasetu_token");
        localStorage.removeItem("biddyasetu_user");
      }
    }
  }, []);

  /**
   * Update Profile Details
   */
  const updateProfile = useCallback(async (profileData) => {
    const response = await api.put("/auth/update-profile", profileData);
    const updatedUser = response.data.data.user;

    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("biddyasetu_user", JSON.stringify(updatedUser));
    }

    return { success: true, user: updatedUser, message: response.data.message };
  }, []);

  /**
   * Change Account Password
   */
  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    const response = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return { success: true, message: response.data.message };
  }, []);

  /**
   * Pay Membership / Activate Subscription
   */
  const payMembership = useCallback(async (paymentData) => {
    const response = await api.post("/auth/pay-membership", paymentData);
    const updatedUser = response.data.data.user;

    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("biddyasetu_user", JSON.stringify(updatedUser));
    }

    return { success: true, user: updatedUser, message: response.data.message };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      payMembership,
      updateProfile,
      changePassword,
      refreshUser,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      payMembership,
      updateProfile,
      changePassword,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
