import { PodcastApiAdapter } from "../PodcastApiAdapter";
import { HttpClient } from "../../http/HttpClient";

// Mock HttpClient
jest.mock("../../http/HttpClient");

describe("PodcastApiAdapter", () => {
  let adapter: PodcastApiAdapter;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = new HttpClient() as jest.Mocked<HttpClient>;
    adapter = new PodcastApiAdapter(mockHttpClient);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTopPodcasts", () => {
    it("should fetch and transform top podcasts", async () => {
      const mockResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { "im:id": "123" } },
              "im:name": { label: "Test Podcast" },
              "im:artist": { label: "Test Artist" },
              "im:image": [
                { label: "small.jpg" },
                { label: "medium.jpg" },
                { label: "large.jpg" },
              ],
              summary: { label: "Test summary" },
            },
          ],
        },
      };

      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await adapter.getTopPodcasts();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("123");
      expect(result[0].name).toBe("Test Podcast");
      expect(result[0].artist).toBe("Test Artist");
      expect(result[0].image).toBe("large.jpg");
    });

    it("should use correct URL for top podcasts", async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue({ feed: { entry: [] } });

      await adapter.getTopPodcasts();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("toppodcasts/limit=100/genre=1310")
      );
    });

    it("should return empty array when no entries", async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue({ feed: {} });

      const result = await adapter.getTopPodcasts();

      expect(result).toEqual([]);
    });

    it("should throw error when fetch fails", async () => {
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error("API Error"));

      await expect(adapter.getTopPodcasts()).rejects.toThrow(
        "Failed to fetch top podcasts"
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle multiple podcasts", async () => {
      const mockResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { "im:id": "1" } },
              "im:name": { label: "Podcast 1" },
              "im:artist": { label: "Artist 1" },
              "im:image": [{ label: "img1.jpg" }],
            },
            {
              id: { attributes: { "im:id": "2" } },
              "im:name": { label: "Podcast 2" },
              "im:artist": { label: "Artist 2" },
              "im:image": [{ label: "img2.jpg" }],
            },
          ],
        },
      };

      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await adapter.getTopPodcasts();

      expect(result).toHaveLength(2);
    });
  });

  describe("getPodcastDetail", () => {
    it("should fetch and transform podcast detail", async () => {
      const mockResponse = {
        results: [
          {
            collectionId: 123,
            collectionName: "Test Podcast",
            artistName: "Test Artist",
            artworkUrl600: "artwork.jpg",
            description: "Test description",
          },
          {
            trackId: 1001,
            trackName: "Episode 1",
            kind: "podcast-episode",
            description: "Episode description",
            releaseDate: "2024-01-15",
            trackTimeMillis: 3600000,
            episodeUrl: "https://example.com/ep1.mp3",
          },
        ],
      };

      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await adapter.getPodcastDetail("123");

      expect(result.id).toBe(123);
      expect(result.name).toBe("Test Podcast");
      expect(result.artist).toBe("Test Artist");
      expect(result.episodes).toHaveLength(1);
    });

    it("should use correct URL with podcast ID", async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue({
        results: [{ collectionId: 456 }],
      });

      await adapter.getPodcastDetail("456");

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("id=456")
      );
    });

    it("should throw error when no results found", async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue({ results: [] });

      await expect(adapter.getPodcastDetail("123")).rejects.toThrow(
        "Failed to fetch podcast detail"
      );
    });

    it("should throw error when results is undefined", async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue({});

      await expect(adapter.getPodcastDetail("123")).rejects.toThrow(
        "Failed to fetch podcast detail"
      );
    });

    it("should throw error when fetch fails", async () => {
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error("API Error"));

      await expect(adapter.getPodcastDetail("123")).rejects.toThrow(
        "Failed to fetch podcast detail"
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("should filter only podcast-episode kind", async () => {
      const mockResponse = {
        results: [
          {
            collectionId: 123,
            collectionName: "Test Podcast",
            artistName: "Test Artist",
          },
          {
            trackId: 1001,
            trackName: "Episode 1",
            kind: "podcast-episode",
            releaseDate: "2024-01-15",
          },
          {
            trackId: 1002,
            trackName: "Not an episode",
            kind: "other",
            releaseDate: "2024-01-16",
          },
        ],
      };

      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await adapter.getPodcastDetail("123");

      expect(result.episodes).toHaveLength(1);
      expect(result.episodes[0].title).toBe("Episode 1");
    });
  });
});
