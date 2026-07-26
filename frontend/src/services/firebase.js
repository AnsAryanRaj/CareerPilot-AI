// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   sendPasswordResetEmail
// } from "firebase/auth";
// import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// // Firebase Configuration, loaded from Vite environment variables
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

// // Initialize Firebase Application
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();

// // Create or verify user profile document in Firestore
// export const createUserProfile = async (user, additionalData = {}) => {
//   if (!user) return;
//   const userRef = doc(db, "users", user.uid);
//   try {
//     const snap = await getDoc(userRef);
//     if (!snap.exists()) {
//       const { email, displayName, photoURL } = user;
//       const profileData = {
//         uid: user.uid,
//         email: email || "",
//         fullName: displayName || additionalData.fullName || (email ? email.split("@")[0] : "Student"),
//         avatarUrl: photoURL || "",
//         onboarded: false,
//         targetRole: "",
//         targetCompanies: [],
//         experienceLevel: "",
//         dsaStreak: 0,
//         createdAt: new Date().toISOString()
//       };
//       await setDoc(userRef, profileData);
//       return profileData;
//     }
//     return snap.data();
//   } catch (error) {
//     console.error("Error creating/getting user profile in Firestore:", error);
//     return null;
//   }
// };

// // Google Sign-In Hook
// export const loginWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     await createUserProfile(result.user);
//     return result.user;
//   } catch (error) {
//     console.error("Google Authentication error:", error);
//     throw error;
//   }
// };

// // Email/Password Signup Hook
// export const registerWithEmail = async (email, password, displayName) => {
//   try {
//     const result = await createUserWithEmailAndPassword(auth, email, password);
//     if (displayName) {
//       await updateProfile(result.user, { displayName });
//     }
//     await createUserProfile(result.user, { fullName: displayName });
//     return result.user;
//   } catch (error) {
//     console.error("Email signup error:", error);
//     throw error;
//   }
// };

// // Email/Password Login Hook
// export const loginWithEmail = async (email, password) => {
//   try {
//     const result = await signInWithEmailAndPassword(auth, email, password);
//     return result.user;
//   } catch (error) {
//     console.error("Email login error:", error);
//     throw error;
//   }
// };

// // Logout Hook
// export const logoutUser = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.error("Sign-out error:", error);
//     throw error;
//   }
// };

// // Forgot Password Hook
// export const resetPassword = async (email) => {
//   try {
//     await sendPasswordResetEmail(auth, email);
//   } catch (error) {
//     console.error("Password reset error:", error);
//     throw error;
//   }
// };

// export default app;


//edited demo code
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Firebase Configuration, loaded from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase Application
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Create or verify user profile document in Firestore
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);

  try {
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const { email, displayName, photoURL } = user;

      const profileData = {
        uid: user.uid,
        email: email || "",
        fullName:
          displayName ||
          additionalData.fullName ||
          (email ? email.split("@")[0] : "Student"),
        avatarUrl: photoURL || "",
        onboarded: false,
        targetRole: "",
        targetCompanies: [],
        experienceLevel: "",
        dsaStreak: 0,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, profileData);
      return profileData;
    }

    return snap.data();
  } catch (error) {
    console.error("Error creating/getting user profile in Firestore:", error);
    return null;
  }
};

// Google Sign-In
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Force refresh token
    await result.user.getIdToken(true);

    await createUserProfile(result.user);

    return result.user;
  } catch (error) {
    console.error("Google Authentication error:", error);
    throw error;
  }
};

// Email Signup
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (displayName) {
      await updateProfile(result.user, {
        displayName,
      });
    }

    await createUserProfile(result.user, {
      fullName: displayName,
    });

    // Force refresh token
    await result.user.getIdToken(true);

    return result.user;
  } catch (error) {
    console.error("Email signup error:", error);
    throw error;
  }
};

// Email Login
export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Force refresh token
    await result.user.getIdToken(true);

    return result.user;
  } catch (error) {
    console.error("Email login error:", error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

// Forgot Password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export default app;