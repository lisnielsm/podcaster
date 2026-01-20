import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import EpisodeList from "../EpisodeList";
import { EpisodeEntity } from "../../../../domain/models/Episode";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("EpisodeList", () => {
  const mockNavigate = jest.fn();
  const mockEpisodes: EpisodeEntity[] = [
    new EpisodeEntity(
      101,
      "Episode 1: Introduction",
      "First episode",
      "2024-01-15T00:00:00Z",
      3661000, // 1:01:01
      "https://example.com/ep1.mp3"
    ),
    new EpisodeEntity(
      102,
      "Episode 2: Deep Dive",
      "Second episode",
      "2024-01-22T00:00:00Z",
      1830000, // 30:30
      "https://example.com/ep2.mp3"
    ),
    new EpisodeEntity(
      103,
      "Episode 3: Conclusion",
      "Third episode",
      "2024-01-29T00:00:00Z",
      undefined,
      "https://example.com/ep3.mp3"
    ),
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

      // Header row has role="row", data rows have role="button" for accessibility
      const headerRows = screen.getAllByRole("row");
      const dataRows = screen.getAllByRole("button");
      expect(headerRows).toHaveLength(1);
      expect(dataRows).toHaveLength(3);
    });

    it("should render empty table when no episodes", () => {
      render(<EpisodeList podcastId={mockPodcastId} episodes={[]} />);

      const headerRows = screen.getAllByRole("row");
      // Only header row, no button rows
      expect(headerRows).toHaveLength(1);
      expect(screen.queryAllByRole("button")).toHaveLength(0);
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
      const episodesWithShortDuration: EpisodeEntity[] = [
        new EpisodeEntity(
          104,
          "Short Episode",
          undefined,
          "2024-02-01T00:00:00Z",
          65000, // 1:05
          undefined
        ),
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
      const episodesWithZeroSeconds: EpisodeEntity[] = [
        new EpisodeEntity(
          105,
          "Zero Seconds Episode",
          undefined,
          "2024-02-01T00:00:00Z",
          3600000, // 1:00:00
          undefined
        ),
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
      const episodesWithZeroDuration: EpisodeEntity[] = [
        new EpisodeEntity(
          106,
          "Zero Duration Episode",
          undefined,
          "2024-02-01T00:00:00Z",
          0,
          undefined
        ),
      ];

      render(
        <EpisodeList
          podcastId={mockPodcastId}
          episodes={episodesWithZeroDuration}
        />
      );

      // Zero is falsy so getDurationFormatted returns "--:--"
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
      const episodesWithDifferentDates: EpisodeEntity[] = [
        new EpisodeEntity(
          107,
          "December Episode",
          undefined,
          "2024-12-15T12:00:00Z",
          1000,
          undefined
        ),
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

    it("should have episode-list__table class on table", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      expect(
        container.querySelector(".episode-list__table")
      ).toBeInTheDocument();
    });

    it("should have episode-list__row class on data rows", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const episodeRows = container.querySelectorAll(".episode-list__row");
      expect(episodeRows).toHaveLength(3);
    });

    it("should have episode-list__title class on title cells", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const titleCells = container.querySelectorAll(".episode-list__title");
      expect(titleCells).toHaveLength(3);
    });

    it("should have episode-list__date class on date cells", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const dateCells = container.querySelectorAll(".episode-list__date");
      expect(dateCells).toHaveLength(3);
    });

    it("should have episode-list__duration class on duration cells", () => {
      const { container } = render(
        <EpisodeList podcastId={mockPodcastId} episodes={mockEpisodes} />
      );

      const durationCells = container.querySelectorAll(
        ".episode-list__duration"
      );
      expect(durationCells).toHaveLength(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle episode with very long title", () => {
      const longTitleEpisode: EpisodeEntity[] = [
        new EpisodeEntity(
          108,
          "This is a very long episode title that might cause layout issues in certain scenarios",
          undefined,
          "2024-02-01T00:00:00Z",
          1000,
          undefined
        ),
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
      const specialCharsEpisode: EpisodeEntity[] = [
        new EpisodeEntity(
          109,
          "Episode <1> & More 'Special' \"Characters\"",
          undefined,
          "2024-02-01T00:00:00Z",
          1000,
          undefined
        ),
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
      const noDescriptionEpisode: EpisodeEntity[] = [
        new EpisodeEntity(
          110,
          "No Description Episode",
          undefined,
          "2024-02-01T00:00:00Z",
          undefined,
          undefined
        ),
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
