import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams, useNavigate } from "react-router-dom";
import PodcastDetailPage from "../PodcastDetailPage";
import { diContainer } from "../../../../config/di-container";
import { PodcastDetail } from "../../../../domain/models/PodcastDetail";
import { EpisodeEntity } from "../../../../domain/models/Episode";

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

describe("PodcastDetailPage", () => {
  const mockNavigate = jest.fn();
  const mockPodcastDetail: PodcastDetail = {
    id: 123,
    name: "The Tech Podcast",
    artist: "Tech Host",
    image: "https://example.com/tech.jpg",
    description: "A podcast about technology and innovation",
    episodes: [
      new EpisodeEntity(
        1,
        "Episode 1: Getting Started",
        undefined,
        "2024-01-15T00:00:00Z",
        3600000,
        undefined
      ),
      new EpisodeEntity(
        2,
        "Episode 2: Going Deeper",
        undefined,
        "2024-01-22T00:00:00Z",
        1800000,
        undefined
      ),
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ podcastId: "123" });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (
      diContainer.getPodcastDetailUseCase.execute as jest.Mock
    ).mockResolvedValue(mockPodcastDetail);
  });

  describe("Loading State", () => {
    it("should show loading spinner while fetching data", () => {
      // Make the promise never resolve to keep loading state
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockImplementation(() => new Promise(() => {}));

      render(<PodcastDetailPage />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should hide loading spinner after data loads", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error State", () => {
    it("should display error message when loading fails", async () => {
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error("Failed to fetch podcast"));

      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Error: Failed to fetch podcast")
        ).toBeInTheDocument();
      });
    });

    it("should display 'Podcast not found' when podcastDetail is null", async () => {
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(null);

      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByText("Error: Podcast not found")).toBeInTheDocument();
      });
    });

    it("should have error CSS class on error container", async () => {
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error("Error"));

      const { container } = render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".podcast-detail-error")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Success State", () => {
    it("should render the podcast sidebar with correct data", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("podcast-sidebar")).toBeInTheDocument();
      });
    });

    it("should pass correct ID to sidebar", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-id")).toHaveTextContent("123");
      });
    });

    it("should pass correct name to sidebar", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-name")).toHaveTextContent(
          "The Tech Podcast"
        );
      });
    });

    it("should pass correct artist to sidebar", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-artist")).toHaveTextContent(
          "Tech Host"
        );
      });
    });

    it("should pass correct description to sidebar", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-description")).toHaveTextContent(
          "A podcast about technology and innovation"
        );
      });
    });

    it("should display episode count", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByText("Episodes: 2")).toBeInTheDocument();
      });
    });

    it("should render the episode list", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Episode 1: Getting Started")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Episode 2: Going Deeper")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Navigation to Episodes", () => {
    it("should navigate to episode detail when clicking on an episode", async () => {
      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Episode 1: Getting Started")
        ).toBeInTheDocument();
      });

      const episodeRow = screen
        .getByText("Episode 1: Getting Started")
        .closest("tr");
      fireEvent.click(episodeRow!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/123/episode/1");
    });
  });

  describe("Different Podcast IDs", () => {
    it("should call use case with correct podcast ID", async () => {
      (useParams as jest.Mock).mockReturnValue({ podcastId: "456" });

      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          diContainer.getPodcastDetailUseCase.execute
        ).toHaveBeenCalledWith("456");
      });
    });

    it("should handle empty podcast ID gracefully", async () => {
      (useParams as jest.Mock).mockReturnValue({ podcastId: undefined });

      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          diContainer.getPodcastDetailUseCase.execute
        ).toHaveBeenCalledWith("");
      });
    });
  });

  describe("Podcast with No Episodes", () => {
    it("should display zero episode count", async () => {
      const emptyPodcast: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [],
      };
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(emptyPodcast);

      render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(screen.getByText("Episodes: 0")).toBeInTheDocument();
      });
    });
  });

  describe("CSS Classes", () => {
    it("should have podcast-detail-page class on container", async () => {
      const { container } = render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".podcast-detail-page")
        ).toBeInTheDocument();
      });
    });

    it("should have podcast-detail-main class on main content", async () => {
      const { container } = render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".podcast-detail-main")
        ).toBeInTheDocument();
      });
    });

    it("should have episodes-header class on header section", async () => {
      const { container } = render(<PodcastDetailPage />);

      await waitFor(() => {
        expect(
          container.querySelector(".episodes-header")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Podcast Without Description", () => {
    it("should handle podcast without description", async () => {
      const noDescriptionPodcast: PodcastDetail = {
        id: 123,
        name: "No Description Podcast",
        artist: "Artist",
        image: "https://example.com/image.jpg",
        episodes: [],
      };
      (
        diContainer.getPodcastDetailUseCase.execute as jest.Mock
      ).mockResolvedValue(noDescriptionPodcast);

      render(<PodcastDetailPage />);

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
