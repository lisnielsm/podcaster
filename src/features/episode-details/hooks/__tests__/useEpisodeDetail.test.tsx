import { renderHook, waitFor } from "@testing-library/react";
import { useEpisodeDetail } from "../useEpisodeDetail";
import { GetEpisodeDetailUseCase } from "../../../../domain/services/GetEpisodeDetailUseCase";
import { GetPodcastDetailUseCase } from "../../../../domain/services/GetPodcastDetailUseCase";
import { EpisodeEntity } from "../../../../domain/models/Episode";
import { PodcastDetail } from "../../../../domain/models/PodcastDetail";

// Mock the use cases
const mockExecuteEpisode = jest.fn();
const mockExecutePodcast = jest.fn();

const mockEpisodeUseCase = {
  execute: mockExecuteEpisode,
} as unknown as GetEpisodeDetailUseCase;

const mockPodcastUseCase = {
  execute: mockExecutePodcast,
} as unknown as GetPodcastDetailUseCase;

describe("useEpisodeDetail", () => {
  const mockEpisode = new EpisodeEntity(
    101,
    "Test Episode",
    "This is a test episode",
    "2024-01-15T00:00:00Z",
    3600000,
    "https://example.com/episode.mp3"
  );

  const mockPodcast: PodcastDetail = {
    id: 123,
    name: "Test Podcast",
    artist: "Test Artist",
    image: "https://example.com/image.jpg",
    description: "Test podcast description",
    episodes: [mockEpisode],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecuteEpisode.mockResolvedValue(mockEpisode);
    mockExecutePodcast.mockResolvedValue(mockPodcast);
  });

  describe("Initial State", () => {
    it("should start with loading true", () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      expect(result.current.loading).toBe(true);
    });

    it("should start with null episode", () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      expect(result.current.episode).toBeNull();
    });

    it("should start with null podcast", () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      expect(result.current.podcast).toBeNull();
    });

    it("should start with no error", () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      expect(result.current.error).toBeNull();
    });
  });

  describe("Data Loading", () => {
    it("should call podcast use case with podcast ID", async () => {
      renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(mockExecutePodcast).toHaveBeenCalledWith("123");
      });
    });

    it("should call episode use case with podcast and episode IDs", async () => {
      renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(mockExecuteEpisode).toHaveBeenCalledWith("123", "101");
      });
    });

    it("should set loading to false after data loads", async () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should populate episode after loading", async () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.episode).toEqual(mockEpisode);
      });
    });

    it("should populate podcast after loading", async () => {
      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcast).toEqual(mockPodcast);
      });
    });
  });

  describe("ID Changes", () => {
    it("should reload when podcast ID changes", async () => {
      const { result, rerender } = renderHook(
        ({ podcastId, episodeId }) =>
          useEpisodeDetail(
            podcastId,
            episodeId,
            mockEpisodeUseCase,
            mockPodcastUseCase
          ),
        { initialProps: { podcastId: "123", episodeId: "101" } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender({ podcastId: "456", episodeId: "101" });

      await waitFor(() => {
        expect(mockExecutePodcast).toHaveBeenCalledWith("456");
      });
    });

    it("should reload when episode ID changes", async () => {
      const { result, rerender } = renderHook(
        ({ podcastId, episodeId }) =>
          useEpisodeDetail(
            podcastId,
            episodeId,
            mockEpisodeUseCase,
            mockPodcastUseCase
          ),
        { initialProps: { podcastId: "123", episodeId: "101" } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender({ podcastId: "123", episodeId: "202" });

      await waitFor(() => {
        expect(mockExecuteEpisode).toHaveBeenCalledWith("123", "202");
      });
    });
  });

  describe("Episode Not Found", () => {
    it("should set error when episode is null", async () => {
      mockExecuteEpisode.mockResolvedValue(null);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "999", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Episode not found");
      });
    });

    it("should set loading to false when episode is not found", async () => {
      mockExecuteEpisode.mockResolvedValue(null);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "999", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should keep episode as null when not found", async () => {
      mockExecuteEpisode.mockResolvedValue(null);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "999", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.episode).toBeNull();
      });
    });

    it("should still have podcast data when episode not found", async () => {
      mockExecuteEpisode.mockResolvedValue(null);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "999", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.podcast).toEqual(mockPodcast);
      });
    });
  });

  describe("Error Handling", () => {
    it("should set error when podcast use case fails", async () => {
      mockExecutePodcast.mockRejectedValue(new Error("Podcast fetch failed"));

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Podcast fetch failed");
      });
    });

    it("should set error when episode use case fails", async () => {
      mockExecuteEpisode.mockRejectedValue(new Error("Episode fetch failed"));

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Episode fetch failed");
      });
    });

    it("should set loading to false on error", async () => {
      mockExecutePodcast.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockExecutePodcast.mockRejectedValue("String error");

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Error loading episode detail");
      });
    });

    it("should handle null rejection", async () => {
      mockExecuteEpisode.mockRejectedValue(null);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "101", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Error loading episode detail");
      });
    });
  });

  describe("Episode Data Variations", () => {
    it("should handle episode without description", async () => {
      const noDescEpisode = new EpisodeEntity(
        102,
        "No Description Episode",
        undefined,
        "2024-01-15T00:00:00Z",
        undefined,
        undefined
      );
      mockExecuteEpisode.mockResolvedValue(noDescEpisode);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "102", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.episode?.description).toBeUndefined();
      });
    });

    it("should handle episode without episodeUrl", async () => {
      const noUrlEpisode = new EpisodeEntity(
        103,
        "No URL Episode",
        "Has description but no audio",
        "2024-01-15T00:00:00Z",
        undefined,
        undefined
      );
      mockExecuteEpisode.mockResolvedValue(noUrlEpisode);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "103", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.episode?.episodeUrl).toBeUndefined();
      });
    });

    it("should handle episode without duration", async () => {
      const noDurationEpisode = new EpisodeEntity(
        104,
        "No Duration Episode",
        undefined,
        "2024-01-15T00:00:00Z",
        undefined,
        undefined
      );
      mockExecuteEpisode.mockResolvedValue(noDurationEpisode);

      const { result } = renderHook(
        () =>
          useEpisodeDetail("123", "104", mockEpisodeUseCase, mockPodcastUseCase)
      );

      await waitFor(() => {
        expect(result.current.episode?.duration).toBeUndefined();
      });
    });
  });
});
