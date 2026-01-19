import { renderHook, act, waitFor } from "@testing-library/react";
import { usePodcastList } from "../usePodcastList";
import { GetTopPodcastsUseCase } from "../../../../domain/services/GetTopPodcastsUseCase";
import { Podcast } from "../../../../domain/models/Podcast";

// Mock the use case
const mockExecute = jest.fn();
const mockUseCase = {
  execute: mockExecute,
} as unknown as GetTopPodcastsUseCase;

describe("usePodcastList", () => {
  const mockPodcasts: Podcast[] = [
    {
      id: "1",
      name: "Rock Podcast",
      artist: "Rock Artist",
      image: "https://example.com/rock.jpg",
    },
    {
      id: "2",
      name: "Jazz Podcast",
      artist: "Jazz Artist",
      image: "https://example.com/jazz.jpg",
    },
    {
      id: "3",
      name: "Pop Music Show",
      artist: "Pop Artist",
      image: "https://example.com/pop.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue(mockPodcasts);
  });

  describe("Initial State", () => {
    it("should start with loading true", () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      expect(result.current.loading).toBe(true);
    });

    it("should start with empty podcasts array", () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      expect(result.current.podcasts).toEqual([]);
    });

    it("should start with empty filter", () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      expect(result.current.filter).toBe("");
    });

    it("should start with no error", () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      expect(result.current.error).toBeNull();
    });
  });

  describe("Data Loading", () => {
    it("should call use case execute on mount", async () => {
      renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledTimes(1);
      });
    });

    it("should set loading to false after data loads", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should populate podcasts after loading", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.podcasts).toEqual(mockPodcasts);
      });
    });

    it("should set totalCount correctly", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.totalCount).toBe(3);
      });
    });

    it("should set filteredCount correctly", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.filteredCount).toBe(3);
      });
    });
  });

  describe("Error Handling", () => {
    it("should set error when use case fails", async () => {
      mockExecute.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
      });
    });

    it("should set loading to false on error", async () => {
      mockExecute.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockExecute.mockRejectedValue("String error");

      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.error).toBe("Error loading podcasts");
      });
    });
  });

  describe("Filtering", () => {
    it("should filter podcasts by name", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("Rock");
      });

      expect(result.current.podcasts).toHaveLength(1);
      expect(result.current.podcasts[0].name).toBe("Rock Podcast");
    });

    it("should filter podcasts by artist", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("Jazz Artist");
      });

      expect(result.current.podcasts).toHaveLength(1);
      expect(result.current.podcasts[0].artist).toBe("Jazz Artist");
    });

    it("should be case insensitive", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("ROCK");
      });

      expect(result.current.podcasts).toHaveLength(1);
    });

    it("should return all podcasts when filter is empty", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("Rock");
      });

      expect(result.current.podcasts).toHaveLength(1);

      act(() => {
        result.current.setFilter("");
      });

      expect(result.current.podcasts).toHaveLength(3);
    });

    it("should return empty array when no matches found", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("xyz123");
      });

      expect(result.current.podcasts).toHaveLength(0);
    });

    it("should update filteredCount when filtering", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("Podcast");
      });

      expect(result.current.filteredCount).toBe(2); // Rock Podcast, Jazz Podcast
    });

    it("should handle whitespace-only filter", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("   ");
      });

      expect(result.current.podcasts).toHaveLength(3);
    });

    it("should match partial strings", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("Mus");
      });

      expect(result.current.podcasts).toHaveLength(1);
      expect(result.current.podcasts[0].name).toBe("Pop Music Show");
    });
  });

  describe("Filter State", () => {
    it("should update filter state", async () => {
      const { result } = renderHook(() => usePodcastList(mockUseCase));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilter("test");
      });

      expect(result.current.filter).toBe("test");
    });
  });
});
