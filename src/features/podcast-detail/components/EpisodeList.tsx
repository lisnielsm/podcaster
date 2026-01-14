import React from "react";
import { useNavigate } from "react-router-dom";
import { Episode } from "../../../core/domain/models/Episode";
import "./EpisodeList.css";

interface EpisodeListProps {
  podcastId: number;
  episodes: Episode[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ podcastId, episodes }) => {
  const navigate = useNavigate();

  const handleEpisodeClick = (episodeId: number) => {
    void navigate(`/podcast/${podcastId}/episode/${episodeId}`);
  };

  const formatDuration = (milliseconds?: number): string => {
    if (!milliseconds) return "--:--";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <section className="episode-list">
      <table className="episode-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Release Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr
              key={episode.id}
              className="episode-row"
              onClick={() => handleEpisodeClick(episode.id)}
            >
              <td className="episode-title">{episode.title}</td>
              <td className="episode-date">
                {formatDate(episode.releaseDate)}
              </td>
              <td className="episode-duration">
                {formatDuration(episode.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EpisodeList;
