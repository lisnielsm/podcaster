import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import EpisodeList from "../EpisodeList";
import { Episode } from "../../../../core/domain/models/Episode";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("EpisodeList", () => {
  const mockNavigate = jest.fn();
  const mockEpisodes: Episode[] = [
    {
      id: 101,
      title: "Episode 1: Introduction",
      description: "First episode",
      releaseDate: "2024-01-15T00:00:00Z",
      duration: 3661000, // 1:01:01
      episodeUrl: "https://example.com/ep1.mp3",
    },
    {
      id: 102,
      title: "Episode 2: Deep Dive",
      description: "Second episode",
      releaseDate: "2024-01-22T00:00:00Z",
      duration: 1830000, // 30:30
      episodeUrl: "https://example.com/ep2.mp3",
    },
    {
      id: 103,
      title: "Episode 3: Conclusion",
      description: "Third episode",
      releaseDate: "2024-01-29T00:00:00Z",
      duration: undefined,
      episodeUrl: "https://example.com/ep3.mp3",
    },
  ];
  const mockPodcastId = 123;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe("Rendering", () => {
    it("should render a table with episodes", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should render table headers", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Release Date")).toBeInTheDocument();
      expect(screen.getByText("Duration")).toBeInTheDocument();
    });

    it("should render all episode titles", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      expect(screen.getByText("Episode 1: Introduction")).toBeInTheDocument();
      expect(screen.getByText("Episode 2: Deep Dive")).toBeInTheDocument();
      expect(screen.getByText("Episode 3: Conclusion")).toBeInTheDocument();
    });

    it("should render the correct number of rows", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      const rows = screen.getAllByRole("row");
      // 1 header row + 3 data rows
      expect(rows).toHaveLength(4);
    });

    it("should render empty table when no episodes", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={[]} />);

      const rows = screen.getAllByRole("row");
      // Only header row
      expect(rows).toHaveLength(1);
    });
  });

  describe("Duration Formatting", () => {
    it("should format duration with hours correctly", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      // 3661000ms = 1:01:01
      expect(screen.getByText("1:01:01")).toBeInTheDocument();
    });

    it("should format duration without hours correctly", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      // 1830000ms = 30:30
      expect(screen.getByText("30:30")).toBeInTheDocument();
    });

    it("should display '--:--' when duration is undefined", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      expect(screen.getByText("--:--")).toBeInTheDocument();
    });

    it("should format short duration correctly", () => {
      const episodesWithShortDuration: Episode[] = [
        {
          id: 104,
          title: "Short Episode",
          releaseDate: "2024-02-01T00:00:00Z",
          duration: 65000, // 1:05
        },
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={episodesWithShortDuration}
        />
      );

      expect(screen.getByText("1:05")).toBeInTheDocument();
    });

    it("should format duration with zero seconds correctly", () => {
      const episodesWithZeroSeconds: Episode[] = [
        {
          id: 105,
          title: "Zero Seconds Episode",
          releaseDate: "2024-02-01T00:00:00Z",
          duration: 3600000, // 1:00:00
        },
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={episodesWithZeroSeconds}
        />
      );

      expect(screen.getByText("1:00:00")).toBeInTheDocument();
    });

    it("should handle zero duration", () => {
      const episodesWithZeroDuration: Episode[] = [
        {
          id: 106,
          title: "Zero Duration Episode",
          releaseDate: "2024-02-01T00:00:00Z",
          duration: 0,
        },
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={episodesWithZeroDuration}
        />
      );

      // Zero is falsy so formatDuration returns "--:--"
      expect(screen.getByText("--:--")).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("should format dates in MM/DD/YYYY format", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      // 2024-01-15 should be 01/15/2024
      expect(screen.getByText("01/15/2024")).toBeInTheDocument();
      expect(screen.getByText("01/22/2024")).toBeInTheDocument();
      expect(screen.getByText("01/29/2024")).toBeInTheDocument();
    });

    it("should handle different date formats", () => {
      const episodesWithDifferentDates: Episode[] = [
        {
          id: 107,
          title: "December Episode",
          releaseDate: "2024-12-15T12:00:00Z",
          duration: 1000,
        },
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={episodesWithDifferentDates}
        />
      );

      expect(screen.getByText("12/15/2024")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate to episode detail when clicking on a row", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      const firstEpisodeRow = screen.getByText("Episode 1: Introduction").closest("tr");
      fireEvent.click(firstEpisodeRow!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/123/episode/101");
    });

    it("should navigate with correct IDs for different episodes", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />);

      const secondEpisodeRow = screen.getByText("Episode 2: Deep Dive").closest("tr");
      fireEvent.click(secondEpisodeRow!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/123/episode/102");
    });

    it("should use the correct podcast ID in navigation", () => {
      const differentPodcastId = 456;
      render(
        <EpisodeList podcastId={differentPodcastId} episodes={mockEpisodes} />
      );

      const firstEpisodeRow = screen.getByText("Episode 1: Introduction").closest("tr");
      fireEvent.click(firstEpisodeRow!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/456/episode/101");
    });
  });

  describe("CSS Classes", () => {
    it("should have episode-list class on section", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      expect(container.querySelector(".episode-list")).toBeInTheDocument();
    });

    it("should have episode-table class on table", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      expect(container.querySelector(".episode-table")).toBeInTheDocument();
    });

    it("should have episode-row class on data rows", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const episodeRows = container.querySelectorAll(".episode-row");
      expect(episodeRows).toHaveLength(3);
    });

    it("should have episode-title class on title cells", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const titleCells = container.querySelectorAll(".episode-title");
      expect(titleCells).toHaveLength(3);
    });

    it("should have episode-date class on date cells", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const dateCells = container.querySelectorAll(".episode-date");
      expect(dateCells).toHaveLength(3);
    });

    it("should have episode-duration class on duration cells", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const durationCells = container.querySelectorAll(".episode-duration");
      expect(durationCells).toHaveLength(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle episode with very long title", () => {
      const longTitleEpisode: Episode[] = [
        {
          id: 108,
          title:
            "This is a very long episode title that might cause layout issues in certain scenarios",
          releaseDate: "2024-02-01T00:00:00Z",
          duration: 1000,
        },
      ];

      render(
        <EpisodeList podcastId={mockPodcastId} episodes={longTitleEpisode} />
      );

      expect(
        screen.getByText(
          "This is a very long episode title that might cause layout issues in certain scenarios"
        )
      ).toBeInTheDocument();
    });

    it("should handle episode with special characters in title", () => {
      const specialCharsEpisode: Episode[] = [
        {
          id: 109,
          title: "Episode <1> & More 'Special' \"Characters\"",
          releaseDate: "2024-02-01T00:00:00Z",
          duration: 1000,
        },
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={specialCharsEpisode}
        />
      );

      expect(
        screen.getByText("Episode <1> & More 'Special' \"Characters\"")
      ).toBeInTheDocument();
    });

    it("should handle episode without description", () => {
      const noDescriptionEpisode: Episode[] = [
        {
          id: 110,
          title: "No Description Episode",
          releaseDate: "2024-02-01T00:00:00Z",
        },
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={noDescriptionEpisode}
        />
      );

      expect(screen.getByText("No Description Episode")).toBeInTheDocument();
    });
  });
});
