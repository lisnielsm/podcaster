import React from "react";
import { useParams } from "react-router-dom";
import { useEpisodeDetail } from "../hooks/useEpisodeDetail";
import { diContainer } from "../../../config/di-container";
import PodcastSidebar from "../../../shared/components/layout/PodcastSidebar";
import EpisodePlayer from "../components/EpisodePlayer";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import "./EpisodeDetailPage.css";

const EpisodeDetailPage: React.FC = () => {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();

  const { episode, podcast, loading, error } = useEpisodeDetail(
    podcastId || "",
    episodeId || "",
    diContainer.getEpisodeDetailUseCase,
    diContainer.getPodcastDetailUseCase
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !episode || !podcast) {
    return (
      <div className="episode-detail-error">
        Error: {error || "Episode not found"}
      </div>
    );
  }

  return (
    <div className="episode-detail-page">
      <PodcastSidebar
        id={podcast.id}
        name={podcast.name}
        artist={podcast.artist}
        image={podcast.image}
        description={podcast.description}
      />

      <main className="episode-detail-main">
        <EpisodePlayer
          title={episode.title}
          description={episode.description}
          audioUrl={episode.episodeUrl}
        />
      </main>
    </div>
  );
};

export default EpisodeDetailPage;
