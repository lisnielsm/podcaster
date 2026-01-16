import React from "react";
import { Link } from "react-router-dom";
import "./PodcastSidebar.css";

interface PodcastSidebarProps {
  id: number;
  name: string;
  artist: string;
  image: string;
  description?: string;
}

const PodcastSidebar: React.FC<PodcastSidebarProps> = ({
  id,
  name,
  artist,
  image,
  description,
}) => {
  return (
    <aside className="podcast-sidebar">
      <div className="podcast-sidebar__card">
        <Link to={`/podcast/${id}`}>
          <img src={image} alt={name} className="podcast-sidebar__image" />
        </Link>
        <div className="podcast-sidebar__content">
          <Link to={`/podcast/${id}`} className="podcast-sidebar__title">
            {name}
          </Link>
          <Link to={`/podcast/${id}`} className="podcast-sidebar__artist">
            by {artist}
          </Link>
        </div>
        {description && (
          <div className="podcast-sidebar__description">
            <h3>Description:</h3>
            <p>{description}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PodcastSidebar;
