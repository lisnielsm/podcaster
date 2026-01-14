import React from "react";
import "./EpisodePlayer.css";

interface EpisodePlayerProps {
  title: string;
  description?: string;
  audioUrl?: string;
}

const EpisodePlayer: React.FC<EpisodePlayerProps> = ({
  title,
  description,
  audioUrl,
}) => {
  return (
    <div className="episode-player">
      <div className="episode-player-header">
        <h2>{title}</h2>
      </div>

      {description && (
        <div
          className="episode-player-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {audioUrl ? (
        <audio controls className="audio-player">
          <source src={audioUrl} type="audio/mpeg" />
          <source src={audioUrl} type="audio/mp4" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div className="episode-player-no-audio">
          <p>No audio available for this episode</p>
        </div>
      )}
    </div>
  );
};

export default EpisodePlayer;
