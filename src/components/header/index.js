import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Importing routing utilities
import { useAuth } from "../../contexts/authContext"; // Importing custom authentication context
import { doSignOut } from "../../firebase/auth"; // Importing sign-out function from Firebase auth utilities

const Header = () => {
  const navigate = useNavigate(); // Hook for programmatically navigating
  const { userLoggedIn } = useAuth(); // Extracting the userLoggedIn status from the authentication context

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm navbg">
      <div className="container-fluid navbg">
        {/* Brand name linking to the home page */}
        <Link className="navbar-brand" to="/">
          Task Manager
        </Link>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links - collapsed in smaller screens */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userLoggedIn ? (
              // If the user is logged in, show the Logout button
              <li className="nav-item">
                <button
                  onClick={() => {
                    doSignOut().then(() => {
                      navigate("/login"); // Redirect to login page after logout
                    });
                  }}
                  className="btn btn-outline-danger ms-2"
                >
                  Logout
                </button>
              </li>
            ) : (
              // If the user is not logged in, show Login and Register links
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary ms-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
