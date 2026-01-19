import { renderHook, waitFor } from "@testing-library/react";
import { usePodcastDetail } from "../usePodcastDetail";
import { GetPodcastDetailUseCase } from "../../../../domain/services/GetPodcastDetailUseCase";
import { PodcastDetail } from "../../../../domain/models/PodcastDetail";

// Mock the use case
const mockExecute = jest.fn();
const mockUseCase = {
  execute: mockExecute,
} as unknown as GetPodcastDetailUseCase;

describe("usePodcastDetail", () => {
  const mockPodcastDetail: PodcastDetail = {
    id: 123,
    name: "Test Podcast",
    artist: "Test Artist",
    image: "https://example.com/image.jpg",
    description: "This is a test podcast description",
    episodes: [
      {
        id: 1,
        title: "Episode 1",
        releaseDate: "2024-01-15T00:00:00Z",
        duration: 3600000,
      },
      {
        id: 2,
        title: "Episode 2",
        releaseDate: "2024-01-22T00:00:00Z",
        duration: 1800000,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue(mockPodcastDetail);
  });

  describe("Initial State", () => {
    it("should start with loading true", () => {
      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      expect(result.current.loading).toBe(true);
    });

    it("should start with null podcastDetail", () => {
      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      expect(result.current.podcastDetail).toBeNull();
    });

    it("should start with no error", () => {
      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      expect(result.current.error).toBeNull();
    });
  });

  describe("Data Loading", () => {
    it("should call use case execute with podcast ID on mount", async () => {
      renderHook(() => usePodcastDetail("123", mockUseCase));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith("123");
      });
    });

    it("should call use case execute once on mount", async () => {
      renderHook(() => usePodcastDetail("123", mockUseCase));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledTimes(1);
      });
    });

    it("should set loading to false after data loads", async () => {
      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should populate podcastDetail after loading", async () => {
      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcastDetail).toEqual(mockPodcastDetail);
      });
    });

    it("should include all episodes in podcastDetail", async () => {
      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcastDetail?.episodes).toHaveLength(2);
      });
    });
  });

  describe("Podcast ID Changes", () => {
    it("should reload data when podcast ID changes", async () => {
      const { result, rerender } = renderHook(
        ({ podcastId }) => usePodcastDetail(podcastId, mockUseCase),
        { initialProps: { podcastId: "123" } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender({ podcastId: "456" });

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith("456");
      });
    });

    it("should call use case twice when podcast ID changes", async () => {
      const { result, rerender } = renderHook(
        ({ podcastId }) => usePodcastDetail(podcastId, mockUseCase),
        { initialProps: { podcastId: "123" } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender({ podcastId: "456" });

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Error Handling", () => {
    it("should set error when use case fails", async () => {
      mockExecute.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
      });
    });

    it("should set loading to false on error", async () => {
      mockExecute.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should keep podcastDetail as null on error", async () => {
      mockExecute.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcastDetail).toBeNull();
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockExecute.mockRejectedValue("String error");

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Error loading podcast detail");
      });
    });

    it("should handle null rejection", async () => {
      mockExecute.mockRejectedValue(null);

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Error loading podcast detail");
      });
    });
  });

  describe("Different Podcast Data", () => {
    it("should handle podcast with no episodes", async () => {
      const emptyPodcast: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [],
      };
      mockExecute.mockResolvedValue(emptyPodcast);

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcastDetail?.episodes).toHaveLength(0);
      });
    });

    it("should handle podcast without description", async () => {
      const noDescriptionPodcast: PodcastDetail = {
        id: 123,
        name: "Test Podcast",
        artist: "Test Artist",
        image: "https://example.com/image.jpg",
        episodes: [],
      };
      mockExecute.mockResolvedValue(noDescriptionPodcast);

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcastDetail?.description).toBeUndefined();
      });
    });

    it("should handle podcast with many episodes", async () => {
      const manyEpisodes = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Episode ${i + 1}`,
        releaseDate: "2024-01-15T00:00:00Z",
        duration: 3600000,
      }));
      const largePodcast: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: manyEpisodes,
      };
      mockExecute.mockResolvedValue(largePodcast);

      const { result } = renderHook(() =>
        usePodcastDetail("123", mockUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcastDetail?.episodes).toHaveLength(100);
      });
    });
  });
});
