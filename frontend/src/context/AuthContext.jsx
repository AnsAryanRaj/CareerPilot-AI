import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  auth,
  db,
  loginWithEmail as firebaseLoginWithEmail,
  registerWithEmail as firebaseRegisterWithEmail,
  loginWithGoogle as firebaseLoginWithGoogle,
  logoutUser as firebaseLogoutUser,
  resetPassword as firebaseResetPassword,
  createUserProfile
} from "../services/firebase";
import { getUserProfile } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // 1. Fetch user profile from Firestore using Firebase SDK
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            // If missing in Firestore, create it and sync
            const profileData = await createUserProfile(user);
            if (profileData) {
              setUserProfile(profileData);
            } else {
              // Fallback to backend API
              const profileRes = await getUserProfile();
              setUserProfile(profileRes.data);
            }
          }
        } catch (err) {
          console.error("Failed to sync user profile with Firestore/API:", err);
          // Standard fallback values if database is unreachable
          setUserProfile({
            uid: user.uid,
            email: user.email || "",
            fullName: user.displayName || (user.email ? user.email.split("@")[0] : "Student"),
            avatarUrl: user.photoURL || "",
            onboarded: false,
            targetRole: "",
            targetCompanies: [],
            experienceLevel: "",
            dsaStreak: 0
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await firebaseLoginWithEmail(email, password);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName) => {
    setLoading(true);
    try {
      const user = await firebaseRegisterWithEmail(email, password, displayName);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await firebaseLoginWithGoogle();
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseLogoutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await firebaseResetPassword(email);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    forgotPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
