import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { db } from "../../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { userLoggedIn } = useAuth();

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(`Passwords don't match`);
      window.location.reload();
    } else {
      if (!isRegistering) {
        setIsRegistering(true);
        try {
          const userCredential = await doCreateUserWithEmailAndPassword(
            email,
            password
          );
          const user = userCredential.user;
          await addUserToFirestore(user);
        } catch (e) {
          alert(e.message);
          window.location.reload();
        }
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/home" replace={true} />}

      <main className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Create a New Account
            </h3>
          </div>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-600">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600">
                Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600">
                Confirm Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {errorMessage && (
              <span className="block text-red-600 font-bold">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${
                isRegistering
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-indigo-600 hover:underline">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
