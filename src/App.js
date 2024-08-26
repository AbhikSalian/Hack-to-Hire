// Import necessary components and hooks from React and React Router
import { BrowserRouter } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

// Component to define and render the application's routes
function AppRoutes() {
  // Define an array of route objects for the application
  const routesArray = [
    {
      path: "*", // Wildcard route for any undefined paths, defaulting to the Login component
      element: <Login />,
    },
    {
      path: "/login", // Route for the Login page
      element: <Login />,
    },
    {
      path: "/register", // Route for the Register page
      element: <Register />,
    },
    {
      path: "/home", // Route for the Home page
      element: <Home />,
    },
  ];

  // Render routes based on the routesArray configuration
  return useRoutes(routesArray);
}

// Main App component
function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Provide authentication context to the entire application */}
      <BrowserRouter>
        {" "}
        {/* Enable routing for the application */}
        <Header /> {/* Render the header component on all pages */}
        <div className="w-full h-screen flex flex-col">
          {" "}
          {/* Container for the routed components */}
          <AppRoutes /> {/* Render routes based on configuration */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; // Export the App component for use in other parts of the application
