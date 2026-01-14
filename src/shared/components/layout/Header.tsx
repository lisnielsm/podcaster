import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loading when changing route
    setIsLoading(true);

    // Hide loading after a small delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-title">
          Podcaster
        </Link>
        {isLoading && <div className="loading-indicator"></div>}
      </div>
    </header>
  );
};

export default Header;
