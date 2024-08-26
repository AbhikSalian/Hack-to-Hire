import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
// import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// Create a context for authentication
const AuthContext = React.createContext();

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component to manage and provide authentication state
export function AuthProvider({ children }) {
  // State variables to manage authentication information
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effect hook to set up Firebase Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe; // Cleanup the observer on unmount
  }, []);

  // Function to initialize user state based on authentication status
  async function initializeUser(user) {
    if (user) {
      // If a user is logged in, set the current user
      setCurrentUser({ ...user });

      // Check if the user logged in using email and password
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      // Check if the user logged in using Google (commented out)
      // const isGoogle = user.providerData.some(
      //   (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      // );
      // setIsGoogleUser(isGoogle);

      // Set user as logged in
      setUserLoggedIn(true);
    } else {
      // If no user is logged in, reset user-related state
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    // Set loading to false after initialization
    setLoading(false);
  }

  // Value to be passed to the AuthContext.Provider
  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
  };

  // Render the children only when loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
