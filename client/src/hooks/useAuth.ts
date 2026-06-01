"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && !token) {
      console.log("Found stored token, restoring session...");
    }
    setIsLoading(false);
    setIsChecked(true);
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    router.push("/auth");
  };

  const requireAuth = (redirect = true) => {
    if (!isAuthenticated && !localStorage.getItem("authToken")) {
      if (redirect) {
        router.push("/auth");
      }
      return false;
    }
    return true;
  };

  const requireGuest = (redirect = true) => {
    if (isAuthenticated || localStorage.getItem("authToken")) {
      if (redirect) {
        router.push("/");
      }
      return false;
    }
    return true;
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated || !!localStorage.getItem("authToken"),
    isLoading,
    isChecked,
    login,
    logout,
    requireAuth,
    requireGuest,
  };
}