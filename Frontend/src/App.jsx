import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ClaimDetails from "./pages/ClaimDetails";
import DataUpload from "./pages/DataUpload";
import SplashPage from "./pages/SplashPage";
import AssetMap from "./pages/AssetMap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminChatbot from "./components/AdminChatbot";

// Wrapper component to handle conditional Navbar
const AppWrapper = () => {
  const location = useLocation();

  // Hide Navbar on login and signup pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/";

  return (
    <div className="h-screen flex flex-col">
      {!hideNavbar && <Navbar />}

      {/* Content area with padding to avoid overlap */}
      <div
        className={`flex-1 overflow-auto ${
          !hideNavbar ? "pt-20" : ""
        } bg-gray-50`}
      >
        <AdminChatbot />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<ClaimDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/assetmap" element={<AssetMap />} />
          <Route path="/dataupload" element={<DataUpload />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
