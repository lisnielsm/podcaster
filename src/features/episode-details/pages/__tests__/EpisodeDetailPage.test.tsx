import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useParams, useNavigate } from "react-router-dom";
import EpisodeDetailPage from "../EpisodeDetailPage";
import { diContainer } from "../../../../config/di-container";
import { Episode } from "../../../../domain/models/Episode";
import { PodcastDetail } from "../../../../domain/models/PodcastDetail";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock the di-container
jest.mock("../../../../config/di-container", () => ({
  diContainer: {
    getEpisodeDetailUseCase: {
      execute: jest.fn(),
    },
    getPodcastDetailUseCase: {
      execute: jest.fn(),
    },
  },
}));

// Mock LoadingSpinner
jest.mock("../../../../shared/components/ui/LoadingSpinner", () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});


// Mock PodcastSidebar
jest.mock("../../../../shared/components/layout/PodcastSidebar", () => {
  return function MockPodcastSidebar({
    id,
    name,
    artist,
    image,
    description,
  }: {
    id: number;
    name: string;
    artist: string;
    image: string;
    description?: string;
  }) {
    return (
      <aside data-testid="podcast-sidebar">
        <div data-testid="sidebar-id">{id}</div>
        <div data-testid="sidebar-name">{name}</div>
        <div data-testid="sidebar-artist">{artist}</div>
        <img src={image} alt={name} data-testid="sidebar-image" />
        {description && (
          <div data-testid="sidebar-description">{description}</div>
        )}
      </aside>
    );
  };
});

// Mock EpisodePlayer
jest.mock("../../components/EpisodePlayer", () => {
  return function MockEpisodePlayer({
    title,
    description,
    audioUrl,
  }: {
    title: string;
    description?: string;
    audioUrl?: string;
  }) {
    return (
      <div data-testid="episode-player">
        <div data-testid="player-title">{title}</div>
        {description && (
          <div data-testid="player-description">{description}</div>
        )}
        {audioUrl && <div data-testid="player-audio-url">{audioUrl}</div>}
      </div>
    );
  };
});

describe("EpisodeDetailPage", () => {
  const mockNavigate = jest.fn();
  const mockEpisode: Episode = {
    id: 101,
    title: "Test Episode Title",
    description: "<p>Episode description with HTML</p>",
    releaseDate: "2024-01-15T00:00:00Z",
    duration: 3600000,
    episodeUrl: "https://example.com/episode.mp3",
  };

  const mockPodcast: PodcastDetail = {
    id: 123,
    name: "Test Podcast",
    artist: "Test Artist",
    image: "https://example.com/podcast.jpg",
    description: "Podcast description",
    episodes: [mockEpisode],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({
      podcastId: "123",
      episodeId: "101",
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (
      diContainer.getPodcastDetailUseCase.execute as jest.Mock
    ).mockResolvedValue(mockPodcast);
    (
      diContainer.getEpisodeDetailUseCase.execute as jest.Mock
    ).mockResolvedValue(mockEpisode);
  });

  describe("Loading State", () => {
    it("should show loading spinner while fetching data", () => {
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockImplementation(() => new Promise(() => {}));

      render(<EpisodeDetailPage />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should hide loading spinner after data loads", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error State", () => {
    it("should display error message when podcast loading fails", async () => {
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error("Failed to fetch podcast"));

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Error: Failed to fetch podcast")
        ).toBeInTheDocument();
      });
    });

    it("should display error message when episode loading fails", async () => {
      (
        diContainer.getEpisodeDetailUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error("Failed to fetch episode"));

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Error: Failed to fetch episode")
        ).toBeInTheDocument();
      });
    });

    it("should display 'Episode not found' when episode is null", async () => {
      (
        diContainer.getEpisodeDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(null);

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Error: Episode not found")
        ).toBeInTheDocument();
      });
    });

    it("should display 'Episode not found' when podcast is null", async () => {
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(null);

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Error: Episode not found")
        ).toBeInTheDocument();
      });
    });

    it("should have error CSS class on error container", async () => {
      (
        diContainer.getEpisodeDetailUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error("Error"));

      const { container } = render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".episode-detail-error")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Success State", () => {
    it("should render the podcast sidebar", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("podcast-sidebar")).toBeInTheDocument();
      });
    });

    it("should pass correct podcast ID to sidebar", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-id")).toHaveTextContent("123");
      });
    });

    it("should pass correct podcast name to sidebar", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-name")).toHaveTextContent(
          "Test Podcast"
        );
      });
    });

    it("should pass correct podcast artist to sidebar", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-artist")).toHaveTextContent(
          "Test Artist"
        );
      });
    });

    it("should render the episode player", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("episode-player")).toBeInTheDocument();
      });
    });

    it("should pass correct episode title to player", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("player-title")).toHaveTextContent(
          "Test Episode Title"
        );
      });
    });

    it("should pass correct episode description to player", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("player-description")).toHaveTextContent(
          "<p>Episode description with HTML</p>"
        );
      });
    });

    it("should pass correct episode audio URL to player", async () => {
      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("player-audio-url")).toHaveTextContent(
          "https://example.com/episode.mp3"
        );
      });
    });
  });

  describe("Different IDs", () => {
    it("should call use cases with correct IDs", async () => {
      (useParams as jest.Mock).mockReturnValue({
        podcastId: "456",
        episodeId: "789",
      });

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          diContainer.getPodcastDetailUseCase.execute
        ).toHaveBeenCalledWith("456");
        expect(
          diContainer.getEpisodeDetailUseCase.execute
        ).toHaveBeenCalledWith("456", "789");
      });
    });

    it("should handle undefined podcast ID gracefully", async () => {
      (useParams as jest.Mock).mockReturnValue({
        podcastId: undefined,
        episodeId: "101",
      });

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          diContainer.getPodcastDetailUseCase.execute
        ).toHaveBeenCalledWith("");
      });
    });

    it("should handle undefined episode ID gracefully", async () => {
      (useParams as jest.Mock).mockReturnValue({
        podcastId: "123",
        episodeId: undefined,
      });

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          diContainer.getEpisodeDetailUseCase.execute
        ).toHaveBeenCalledWith("123", "");
      });
    });
  });

  describe("CSS Classes", () => {
    it("should have episode-detail-page class on container", async () => {
      const { container } = render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".episode-detail-page")
        ).toBeInTheDocument();
      });
    });

    it("should have episode-detail-main class on main content", async () => {
      const { container } = render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".episode-detail-main")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Episode Without Optional Fields", () => {
    it("should handle episode without description", async () => {
      const noDescEpisode: Episode = {
        id: 102,
        title: "No Description Episode",
        releaseDate: "2024-01-15T00:00:00Z",
      };
      (
        diContainer.getEpisodeDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(noDescEpisode);

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("player-title")).toHaveTextContent(
          "No Description Episode"
        );
      });

      expect(
        screen.queryByTestId("player-description")
      ).not.toBeInTheDocument();
    });

    it("should handle episode without audio URL", async () => {
      const noAudioEpisode: Episode = {
        id: 103,
        title: "No Audio Episode",
        releaseDate: "2024-01-15T00:00:00Z",
        description: "Has description",
      };
      (
        diContainer.getEpisodeDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(noAudioEpisode);

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("player-title")).toHaveTextContent(
          "No Audio Episode"
        );
      });

      expect(screen.queryByTestId("player-audio-url")).not.toBeInTheDocument();
    });
  });

  describe("Podcast Without Description", () => {
    it("should handle podcast without description", async () => {
      const noDescPodcast: PodcastDetail = {
        id: 123,
        name: "No Description Podcast",
        artist: "Artist",
        image: "https://example.com/image.jpg",
        episodes: [],
      };
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(noDescPodcast);

      render(<EpisodeDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-name")).toHaveTextContent(
          "No Description Podcast"
        );
      });

      expect(
        screen.queryByTestId("sidebar-description")
      ).not.toBeInTheDocument();
    });
  });
});
