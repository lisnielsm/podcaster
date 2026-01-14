import React from "react";
import { useParams } from "react-router-dom";
import { usePodcastDetail } from "../hooks/usePodcastDetail";
import { diContainer } from "../../../config/di-container";
import PodcastSidebar from "../../../shared/components/layout/PodcastSidebar";
import EpisodeList from "../components/EpisodeList";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import "./PodcastDetailPage.css";

const PodcastDetailPage: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();

  const { podcastDetail, loading, error } = usePodcastDetail(
    podcastId || "",
    diContainer.getPodcastDetailUseCase
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !podcastDetail) {
    return (
      <div className="podcast-detail-error">
        Error: {error || "Podcast not found"}
      </div>
    );
  }

  return (
    <div className="podcast-detail-page">
      <PodcastSidebar
        id={podcastDetail.id}
        name={podcastDetail.name}
        artist={podcastDetail.artist}
        image={podcastDetail.image}
        description={podcastDetail.description}
      />

      <main className="podcast-detail-main">
        <div className="episodes-header">
          <h2>Episodes: {podcastDetail.episodes.length}</h2>
        </div>

        <EpisodeList
          podcastId={podcastDetail.id}
          episodes={podcastDetail.episodes}
        />
      </main>
    </div>
  );
};

export default PodcastDetailPage;
