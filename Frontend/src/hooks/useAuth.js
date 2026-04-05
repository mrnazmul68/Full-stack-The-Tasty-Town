import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authApi } from "../services/api";

const AUTH_STORAGE_KEY = "tastytown-user-profile";

const sanitizeUserProfile = (profile) => {
  if (!profile) return null;
  const safeProfile = { ...profile };
  delete safeProfile.password;
  delete safeProfile.passwordHash;
  return {
    role: "customer",
    phone: "",
    address: "",
    photo: null,
    memberSince: String(new Date().getFullYear()),
    rememberMe: true,
    ...safeProfile,
  };
};

const getStoredUserProfile = () => {
  const storageCandidates = [window.localStorage, window.sessionStorage];
  for (const storage of storageCandidates) {
    const savedProfile = storage.getItem(AUTH_STORAGE_KEY);
    if (!savedProfile) continue;
    try {
      return sanitizeUserProfile(JSON.parse(savedProfile));
    } catch {
      storage.removeItem(AUTH_STORAGE_KEY);
    }
  }
  return null;
};

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState(() => getStoredUserProfile());

  useEffect(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    if (userProfile) {
      const storage = userProfile.rememberMe ? window.localStorage : window.sessionStorage;
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const login = async (creds) => {
    const res = await authApi.login(creds);
    const profile = sanitizeUserProfile({ 
      ...res.user, 
      rememberMe: creds.rememberMe, 
      adminToken: res.adminToken || null 
    });
    setUserProfile(profile);
    toast.success("Welcome back!");
    return profile;
  };

  const register = async (creds) => {
    const res = await authApi.register(creds);
    const profile = sanitizeUserProfile({ 
      ...res.user, 
      rememberMe: creds.rememberMe 
    });
    setUserProfile(profile);
    toast.success("Welcome to Tasty Town!");
    return profile;
  };

  const logout = () => {
    setUserProfile(null);
    toast.success("Logged out successfully.");
  };

  return {
    userProfile,
    setUserProfile,
    login,
    register,
    logout,
    isAdmin: userProfile?.role === "admin",
  };
};
