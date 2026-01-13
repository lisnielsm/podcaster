import React from "react";
import "./PodcastFilter.css";

interface PodcastFilterProps {
  filter: string;
  onFilterChange: (value: string) => void;
  resultsCount: number;
}

const PodcastFilter: React.FC<PodcastFilterProps> = ({
  filter,
  onFilterChange,
  resultsCount,
}) => {
  return (
    <div className="podcast-filter">
      <span className="filter-badge">{resultsCount}</span>
      <input
        id="podcast-filter-input"
        type="text"
        className="filter-input"
        placeholder="Filter podcasts..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </div>
  );
};

export default PodcastFilter;
