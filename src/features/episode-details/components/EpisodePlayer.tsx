import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import "./EpisodePlayer.css";

interface EpisodePlayerProps {
  title: string;
  description?: string;
  audioUrl?: string;
}

// Configure DOMPurify with allowed tags and attributes
const SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "span",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
  // Force all links to open in new tab with security attributes
  ADD_ATTR: ["target", "rel"],
};

const EpisodePlayer: React.FC<EpisodePlayerProps> = ({
  title,
  description,
  audioUrl,
}) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedDescription = useMemo(() => {
    if (!description) return "";

    // Sanitize the HTML
    let clean = DOMPurify.sanitize(description, SANITIZE_CONFIG);

    // Add security attributes to all links
    clean = clean.replace(
      /<a\s/g,
      '<a target="_blank" rel="noopener noreferrer" '
    );

    return clean;
  }, [description]);

  return (
    <div className="episode-player">
      <div className="episode-player__header">
        <h2>{title}</h2>
      </div>

      {description && (
        <div
          className="episode-player__description"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      )}

      {audioUrl ? (
        <audio controls className="episode-player__audio">
          <source src={audioUrl} type="audio/mpeg" />
          <source src={audioUrl} type="audio/mp4" />
          <track kind="captions" srcLang="en" label="English captions" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div className="episode-player__no-audio">
          <p>No audio available for this episode</p>
        </div>
      )}
    </div>
  );
};

export default EpisodePlayer;
