import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="loading-spinner"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-spinner__icon" aria-hidden="true"></div>
      <span className="visually-hidden">Loading content, please wait...</span>
    </div>
  );
};

export default LoadingSpinner;
