import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loading indicator when route changes
    setIsLoading(true);

    // Hide after route transition completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__title">
          Podcaster
        </Link>
        {isLoading && (
          <div
            className="header__loading-indicator"
            role="status"
            aria-label="Loading"
            aria-live="polite"
          ></div>
        )}
      </div>
    </header>
  );
};

export default Header;
