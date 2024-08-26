import React from "react";
import { useAuth } from "../../contexts/authContext"; // Importing the custom authentication context
import Task from "./Task"; // Importing the Task component

const Home = () => {
  const { currentUser } = useAuth(); // Extracting the current user from the authentication context

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        {/* Displaying a personalized greeting using the user's display name or email */}
        <h2 className="card-title">
          Hello,{" "}
          {currentUser.displayName
            ? currentUser.displayName
            : currentUser.email}
          !
        </h2>
        <p className="lead">Never miss a deadline!</p>{" "}
        {/* Subheading with a motivational message */}
        <hr />{" "}
        {/* A horizontal line to separate the greeting from the Task component */}
        <Task /> {/* Rendering the Task component */}
      </div>
    </div>
  );
};

export default Home;
