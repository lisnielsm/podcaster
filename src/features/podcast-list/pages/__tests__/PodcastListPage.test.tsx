import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import PodcastListPage from "../PodcastListPage";
import { diContainer } from "../../../../config/di-container";
import { Podcast } from "../../../../domain/models/Podcast";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock the di-container
jest.mock("../../../../config/di-container", () => ({
  diContainer: {
    getTopPodcastsUseCase: {
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


describe("PodcastListPage", () => {
  const mockNavigate = jest.fn();
  const mockPodcasts: Podcast[] = [
    {
      id: "1",
      name: "The Rock Show",
      artist: "Rock Artist",
      image: "https://example.com/rock.jpg",
    },
    {
      id: "2",
      name: "Jazz Hour",
      artist: "Jazz Musician",
      image: "https://example.com/jazz.jpg",
    },
    {
      id: "3",
      name: "Pop Hits",
      artist: "Pop Star",
      image: "https://example.com/pop.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (diContainer.getTopPodcastsUseCase.execute as jest.Mock).mockResolvedValue(
      mockPodcasts
    );
  });

  describe("Loading State", () => {
    it("should show loading spinner while fetching data", () => {
      // Make the promise never resolve to keep loading state
      (
        diContainer.getTopPodcastsUseCase.execute as jest.Mock
      ).mockImplementation(() => new Promise(() => {}));

      render(<PodcastListPage />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should hide loading spinner after data loads", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error State", () => {
    it("should display error message when loading fails", async () => {
      (
        diContainer.getTopPodcastsUseCase.execute as jest.Mock
      ).mockRejectedValue(new Error("Failed to fetch"));

      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
      });
    });
  });

  describe("Success State", () => {
    it("should render all podcasts", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("The Rock Show")).toBeInTheDocument();
        expect(screen.getByText("Jazz Hour")).toBeInTheDocument();
        expect(screen.getByText("Pop Hits")).toBeInTheDocument();
      });
    });

    it("should render the filter component", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Filter podcasts...")
        ).toBeInTheDocument();
      });
    });

    it("should display the correct count in the filter badge", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("3")).toBeInTheDocument();
      });
    });
  });

  describe("Filtering Integration", () => {
    it("should filter podcasts when typing in filter input", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("The Rock Show")).toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Filter podcasts...");
      fireEvent.change(filterInput, { target: { value: "Rock" } });

      expect(screen.getByText("The Rock Show")).toBeInTheDocument();
      expect(screen.queryByText("Jazz Hour")).not.toBeInTheDocument();
      expect(screen.queryByText("Pop Hits")).not.toBeInTheDocument();
    });

    it("should update count when filtering", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("3")).toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Filter podcasts...");
      fireEvent.change(filterInput, { target: { value: "Rock" } });

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should show no results message when filter has no matches", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("The Rock Show")).toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Filter podcasts...");
      fireEvent.change(filterInput, { target: { value: "xyz123" } });

      expect(
        screen.getByText('No podcasts found matching "xyz123"')
      ).toBeInTheDocument();
    });

    it("should filter by artist name", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("The Rock Show")).toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Filter podcasts...");
      fireEvent.change(filterInput, { target: { value: "Jazz Musician" } });

      expect(screen.getByText("Jazz Hour")).toBeInTheDocument();
      expect(screen.queryByText("The Rock Show")).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate to podcast detail when clicking a card", async () => {
      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("The Rock Show")).toBeInTheDocument();
      });

      const card = screen.getByText("The Rock Show").closest(".podcast-card");
      fireEvent.click(card!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/1");
    });
  });

  describe("Empty State", () => {
    it("should handle empty podcast list", async () => {
      (
        diContainer.getTopPodcastsUseCase.execute as jest.Mock
      ).mockResolvedValue([]);

      render(<PodcastListPage />);

      await waitFor(() => {
        expect(screen.getByText("0")).toBeInTheDocument();
      });
    });
  });
});
