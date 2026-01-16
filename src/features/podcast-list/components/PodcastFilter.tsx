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
    <div className="podcast-filter" role="search">
      <span
        className="podcast-filter__badge"
        aria-live="polite"
        aria-label={`${resultsCount} podcasts found`}
      >
        {resultsCount}
      </span>
      <label htmlFor="podcast-filter-input" className="visually-hidden">
        Filter podcasts
      </label>
      <input
        id="podcast-filter-input"
        type="text"
        className="podcast-filter__input"
        placeholder="Filter podcasts..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-describedby="filter-results-count"
      />
      <span id="filter-results-count" className="visually-hidden">
        {resultsCount} results available
      </span>
    </div>
  );
};

export default PodcastFilter;
