import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { db } from "../../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate(); // Navigation hook to redirect users after registration
  const [email, setEmail] = useState(""); // State to manage email input
  const [password, setPassword] = useState(""); // State to manage password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State to manage password confirmation input
  const [isRegistering, setIsRegistering] = useState(false); // State to manage the registration process
  const [errorMessage, setErrorMessage] = useState(""); // State to display error messages

  const { userLoggedIn } = useAuth(); // Extracting the userLoggedIn status from the authentication context

  // Function to add the user to Firestore after successful registration
  async function addUserToFirestore(user) {
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName || "Anonymous",
        createdAt: new Date(),
      });
      console.log("User added to Firestore successfully.");
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
  }

  // Function to handle the form submission for user registration
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match"); // Set error message if passwords do not match
    } else {
      if (!isRegistering) {
        setIsRegistering(true); // Disable the form to prevent multiple submissions
        try {
          const userCredential = await doCreateUserWithEmailAndPassword(
            email,
            password
          ); // Firebase function to create a user with email and password
          const user = userCredential.user;
          await addUserToFirestore(user); // Add the user to Firestore
          navigate("/home"); // Redirect to home after successful registration
        } catch (e) {
          setErrorMessage(e.message); // Set error message if registration fails
          setIsRegistering(false); // Re-enable the form
        }
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}{" "}
      {/* Redirect to home if the user is already logged in */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-lg p-4 border-0">
          <h3 className="card-title text-center mb-4">Create a New Account</h3>
          <form onSubmit={onSubmit}>
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
                disabled={isRegistering} // Disable input while registering
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state on input change
                disabled={isRegistering} // Disable input while registering
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
                className={`btn btn-primary ${isRegistering ? "disabled" : ""}`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}{" "}
                {/* Show different text based on the registration state */}
              </button>
            </div>

            <div className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
