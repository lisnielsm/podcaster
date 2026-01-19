import React from "react";
import { useNavigate } from "react-router-dom";
import { Podcast } from "../../../domain/models/Podcast";
import "./PodcastCard.css";

interface PodcastCardProps {
  podcast: Podcast;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate(`/podcast/${podcast.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className="podcast-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View podcast: ${podcast.name} by ${podcast.artist}`}
    >
      <div className="podcast-card__image-container">
        <img
          src={podcast.image}
          alt={podcast.name}
          className="podcast-card__image"
        />
      </div>
      <div className="podcast-card__content">
        <h3 className="podcast-card__title">{podcast.name}</h3>
        <p className="podcast-card__artist">Author: {podcast.artist}</p>
      </div>
    </article>
  );
};

export default PodcastCard;
