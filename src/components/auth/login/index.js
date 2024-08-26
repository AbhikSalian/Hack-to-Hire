import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../contexts/authContext";

const Login = () => {
  const { userLoggedIn } = useAuth(); // Extracting the userLoggedIn status from the authentication context

  const [email, setEmail] = useState(""); // State to handle email input
  const [password, setPassword] = useState(""); // State to handle password input
  const [isSigningIn, setIsSigningIn] = useState(false); // State to handle the sign-in process
  const [errorMessage, setErrorMessage] = useState(""); // State to display error messages

  // Function to handle form submission for email/password sign-in
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true); // Disables the button to prevent multiple sign-in attempts
      try {
        await doSignInWithEmailAndPassword(email, password); // Firebase function to sign in with email and password
      } catch (e) {
        setErrorMessage(e.message); // Set error message if sign-in fails
        setIsSigningIn(false); // Re-enable the button
      }
    }
  };

  // Function to handle Google Sign-In
  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true); // Disables the button to prevent multiple sign-in attempts
      try {
        const user = await doSignInWithGoogle(); // Firebase function to sign in with Google

        // Check if the user exists in the Firestore database
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        // If the user does not exist in the Firestore database, create a new document
        if (querySnapshot.empty) {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName || "Anonymous",
            createdAt: new Date(),
          });
        }
      } catch (error) {
        setErrorMessage(error.message); // Set error message if sign-in fails
        setIsSigningIn(false); // Re-enable the button
      }
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}{" "}
      {/* Redirects the user to the home page if already logged in */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow-lg border-0">
          <h3 className="card-title text-center mb-4">Welcome Back</h3>
          <form onSubmit={onSubmit} className="mb-3">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on input change
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on input change
              />
            </div>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage} {/* Display error message if exists */}
              </div>
            )}
            <div className="d-grid">
              <button
                type="submit"
                className={`btn btn-primary ${isSigningIn ? "disabled" : ""}`}
              >
                {isSigningIn ? "Signing In..." : "Sign In"}{" "}
                {/* Display signing in text or sign in button */}
              </button>
            </div>
          </form>
          <p className="text-center">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-decoration-none">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
