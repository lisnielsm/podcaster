import React from "react";
import { usePodcastList } from "../hooks/usePodcastList";
import { diContainer } from "../../../config/di-container";
import PodcastCard from "../components/PodcastCard";
import PodcastFilter from "../components/PodcastFilter";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import "./PodcastListPage.css";

const PodcastListPage: React.FC = () => {
  const { podcasts, loading, error, filter, setFilter, filteredCount } =
    usePodcastList(diContainer.getTopPodcastsUseCase);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="podcast-list-error">Error: {error}</div>;
  }

  return (
    <div className="podcast-list-page">
      <PodcastFilter
        filter={filter}
        onFilterChange={setFilter}
        resultsCount={filteredCount}
      />

      <div className="podcast-grid">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>

      {podcasts.length === 0 && filter && (
        <div className="no-results">No podcasts found matching "{filter}"</div>
      )}
    </div>
  );
};

export default PodcastListPage;
