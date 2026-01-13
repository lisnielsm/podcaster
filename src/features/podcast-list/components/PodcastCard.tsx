import React from "react";
import { useNavigate } from "react-router-dom";
import { Podcast } from "../../../core/domain/models/Podcast";
import "./PodcastCard.css";

interface PodcastCardProps {
  podcast: Podcast;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/podcast/${podcast.id}`);
  };

  return (
    <div className="podcast-card" onClick={handleClick}>
      <div className="podcast-card-image-container">
        <img
          src={podcast.image}
          alt={podcast.name}
          className="podcast-card-image"
        />
      </div>
      <div className="podcast-card-content">
        <h3 className="podcast-card-title">{podcast.name}</h3>
        <p className="podcast-card-artist">Author: {podcast.artist}</p>
      </div>
    </div>
  );
};

export default PodcastCard;
