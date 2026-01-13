import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoading = false }) => {
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
