import React from "react";
import { useNavigate } from "react-router-dom";
import { EpisodeEntity } from "../../../domain/models/Episode";
import "./EpisodeList.css";

interface EpisodeListProps {
  podcastId: number;
  episodes: EpisodeEntity[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ podcastId, episodes }) => {
  const navigate = useNavigate();

  const handleEpisodeClick = (episodeId: number) => {
    void navigate(`/podcast/${podcastId}/episode/${episodeId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, episodeId: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleEpisodeClick(episodeId);
    }
  };

  return (
    <section className="episode-list" aria-label="Episode list">
      <table className="episode-list__table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Release Date</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr
              key={episode.id}
              className="episode-list__row"
              onClick={() => handleEpisodeClick(episode.id)}
              onKeyDown={(e) => handleKeyDown(e, episode.id)}
              tabIndex={0}
              role="button"
              aria-label={`Play episode: ${episode.title}, released ${episode.getReleaseDateFormatted()}, duration ${episode.getDurationFormatted()}`}
            >
              <td className="episode-list__title">{episode.title}</td>
              <td className="episode-list__date">
                {episode.getReleaseDateFormatted()}
              </td>
              <td className="episode-list__duration">
                {episode.getDurationFormatted()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EpisodeList;
