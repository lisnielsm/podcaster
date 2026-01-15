import React from "react";
import { render, screen } from "@testing-library/react";
import EpisodePlayer from "../EpisodePlayer";

describe("EpisodePlayer", () => {
  const defaultProps = {
    title: "Test Episode Title",
    description: "<p>This is the episode description</p>",
    audioUrl: "https://example.com/episode.mp3",
  };

  describe("Rendering", () => {
    it("should render the episode title", () => {
      render(<EpisodePlayer {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Test Episode Title" })
      ).toBeInTheDocument();
    });

    it("should render the audio player when audioUrl is provided", () => {
      render(<EpisodePlayer {...defaultProps} />);

      const audioElement = document.querySelector("audio");
      expect(audioElement).toBeInTheDocument();
      expect(audioElement).toHaveAttribute("controls");
    });

    it("should render source elements with correct src", () => {
      render(<EpisodePlayer {...defaultProps} />);

      const sourceElements = document.querySelectorAll("source");
      expect(sourceElements).toHaveLength(2);
      expect(sourceElements[0]).toHaveAttribute(
        "src",
        "https://example.com/episode.mp3"
      );
      expect(sourceElements[1]).toHaveAttribute(
        "src",
        "https://example.com/episode.mp3"
      );
    });

    it("should render source with audio/mpeg type", () => {
      render(<EpisodePlayer {...defaultProps} />);

      const sourceElements = document.querySelectorAll("source");
      expect(sourceElements[0]).toHaveAttribute("type", "audio/mpeg");
    });

    it("should render source with audio/mp4 type", () => {
      render(<EpisodePlayer {...defaultProps} />);

      const sourceElements = document.querySelectorAll("source");
      expect(sourceElements[1]).toHaveAttribute("type", "audio/mp4");
    });
  });

  describe("Description Handling", () => {
    it("should render description with HTML interpreted", () => {
      render(<EpisodePlayer {...defaultProps} />);

      const descriptionElement = document.querySelector(
        ".episode-player-description"
      );
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement?.innerHTML).toBe(
        "<p>This is the episode description</p>"
      );
    });

    it("should render complex HTML in description", () => {
      const complexDescription =
        "<h3>Heading</h3><ul><li>Item 1</li><li>Item 2</li></ul><a href='#'>Link</a>";
      render(
        <EpisodePlayer {...defaultProps} description={complexDescription} />
      );

      const descriptionElement = document.querySelector(
        ".episode-player-description"
      );
      expect(descriptionElement?.querySelector("h3")).toBeInTheDocument();
      expect(descriptionElement?.querySelectorAll("li")).toHaveLength(2);
      expect(descriptionElement?.querySelector("a")).toBeInTheDocument();
    });

    it("should not render description section when description is undefined", () => {
      render(
        <EpisodePlayer title="Test" audioUrl="https://example.com/ep.mp3" />
      );

      const descriptionElement = document.querySelector(
        ".episode-player-description"
      );
      expect(descriptionElement).not.toBeInTheDocument();
    });

    it("should not render description section when description is empty string", () => {
      render(
        <EpisodePlayer
          title="Test"
          description=""
          audioUrl="https://example.com/ep.mp3"
        />
      );

      const descriptionElement = document.querySelector(
        ".episode-player-description"
      );
      expect(descriptionElement).not.toBeInTheDocument();
    });
  });

  describe("No Audio Handling", () => {
    it("should show 'No audio available' message when audioUrl is undefined", () => {
      render(<EpisodePlayer title="Test" description="Description" />);

      expect(
        screen.getByText("No audio available for this episode")
      ).toBeInTheDocument();
    });

    it("should not render audio element when audioUrl is undefined", () => {
      render(<EpisodePlayer title="Test" description="Description" />);

      const audioElement = document.querySelector("audio");
      expect(audioElement).not.toBeInTheDocument();
    });

    it("should show 'No audio available' message when audioUrl is empty string", () => {
      render(
        <EpisodePlayer title="Test" description="Description" audioUrl="" />
      );

      expect(
        screen.getByText("No audio available for this episode")
      ).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should have episode-player class on container", () => {
      const { container } = render(<EpisodePlayer {...defaultProps} />);

      expect(container.querySelector(".episode-player")).toBeInTheDocument();
    });

    it("should have episode-player-header class on header", () => {
      const { container } = render(<EpisodePlayer {...defaultProps} />);

      expect(
        container.querySelector(".episode-player-header")
      ).toBeInTheDocument();
    });

    it("should have episode-player-description class on description", () => {
      const { container } = render(<EpisodePlayer {...defaultProps} />);

      expect(
        container.querySelector(".episode-player-description")
      ).toBeInTheDocument();
    });

    it("should have audio-player class on audio element", () => {
      const { container } = render(<EpisodePlayer {...defaultProps} />);

      expect(container.querySelector(".audio-player")).toBeInTheDocument();
    });

    it("should have episode-player-no-audio class when no audio", () => {
      const { container } = render(<EpisodePlayer title="Test" />);

      expect(
        container.querySelector(".episode-player-no-audio")
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long title", () => {
      const longTitle =
        "This is a very long episode title that might cause layout issues in certain scenarios when displayed on screen";

      render(
        <EpisodePlayer
          title={longTitle}
          audioUrl="https://example.com/ep.mp3"
        />
      );

      expect(
        screen.getByRole("heading", { name: longTitle })
      ).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const specialTitle = "Episode & Special <Characters> 'Test' \"Quotes\"";

      render(
        <EpisodePlayer
          title={specialTitle}
          audioUrl="https://example.com/ep.mp3"
        />
      );

      expect(
        screen.getByRole("heading", { name: specialTitle })
      ).toBeInTheDocument();
    });

    it("should handle different audio URL formats", () => {
      render(
        <EpisodePlayer
          title="Test"
          audioUrl="https://cdn.example.com/audio/ep123.m4a?token=abc123"
        />
      );

      const sourceElements = document.querySelectorAll("source");
      expect(sourceElements[0]).toHaveAttribute(
        "src",
        "https://cdn.example.com/audio/ep123.m4a?token=abc123"
      );
    });

    it("should render only title when no description and no audio", () => {
      render(<EpisodePlayer title="Just Title" />);

      expect(
        screen.getByRole("heading", { name: "Just Title" })
      ).toBeInTheDocument();
      expect(
        document.querySelector(".episode-player-description")
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("No audio available for this episode")
      ).toBeInTheDocument();
    });
  });
});
