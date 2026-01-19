import { PodcastDetailEntity } from "../PodcastDetail";
import { PodcastDetailResult } from "../ApiTypes";

describe("PodcastDetailEntity", () => {
  describe("constructor", () => {
    it("should create a podcast detail with all properties", () => {
      const episodes = [
        { id: 1, title: "Episode 1", releaseDate: "2024-01-15" },
      ];

      const podcastDetail = new PodcastDetailEntity(
        123,
        "Test Podcast",
        "Test Artist",
        "https://example.com/image.jpg",
        "Test description",
        episodes
      );

      expect(podcastDetail.id).toBe(123);
      expect(podcastDetail.name).toBe("Test Podcast");
      expect(podcastDetail.artist).toBe("Test Artist");
      expect(podcastDetail.image).toBe("https://example.com/image.jpg");
      expect(podcastDetail.description).toBe("Test description");
      expect(podcastDetail.episodes).toEqual(episodes);
    });

    it("should create a podcast detail with undefined description", () => {
      const podcastDetail = new PodcastDetailEntity(
        124,
        "No Description",
        "Artist",
        "image.jpg",
        undefined,
        []
      );

      expect(podcastDetail.description).toBeUndefined();
    });
  });

  describe("fromApiResponse", () => {
    it("should create podcast detail from API response", () => {
      const apiResults = [
        {
          collectionId: 456,
          collectionName: "API Podcast",
          artistName: "API Artist",
          artworkUrl600: "artwork600.jpg",
          description: "API description",
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
      ] as unknown as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.id).toBe(456);
      expect(podcastDetail.name).toBe("API Podcast");
      expect(podcastDetail.artist).toBe("API Artist");
      expect(podcastDetail.image).toBe("artwork600.jpg");
      expect(podcastDetail.episodes).toHaveLength(1);
    });

    it("should filter only podcast-episode kind", () => {
      const apiResults = [
        {
          collectionId: 457,
          collectionName: "Podcast",
          artistName: "Artist",
        },
        {
          trackId: 1001,
          trackName: "Episode",
          kind: "podcast-episode",
          releaseDate: "2024-01-15",
        },
        {
          trackId: 1002,
          trackName: "Not Episode",
          kind: "other-kind",
          releaseDate: "2024-01-16",
        },
      ] as unknown as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.episodes).toHaveLength(1);
      expect(podcastDetail.episodes[0].title).toBe("Episode");
    });

    it("should use artworkUrl100 when artworkUrl600 is not available", () => {
      const apiResults = [
        {
          collectionId: 458,
          collectionName: "Podcast",
          artistName: "Artist",
          artworkUrl100: "artwork100.jpg",
        },
      ] as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.image).toBe("artwork100.jpg");
    });

    it("should use collectionArtistName when artistName is not available", () => {
      const apiResults = [
        {
          collectionId: 459,
          collectionName: "Podcast",
          collectionArtistName: "Collection Artist",
        },
      ] as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.artist).toBe("Collection Artist");
    });

    it("should default to 'Unknown' when no artist name is available", () => {
      const apiResults = [
        {
          collectionId: 460,
          collectionName: "Podcast",
        },
      ] as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.artist).toBe("Unknown");
    });

    it("should handle empty image when no artwork is available", () => {
      const apiResults = [
        {
          collectionId: 461,
          collectionName: "Podcast",
          artistName: "Artist",
        },
      ] as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.image).toBe("");
    });

    it("should handle multiple episodes", () => {
      const apiResults = [
        {
          collectionId: 462,
          collectionName: "Podcast",
          artistName: "Artist",
        },
        {
          trackId: 1001,
          trackName: "Episode 1",
          kind: "podcast-episode",
          releaseDate: "2024-01-15",
        },
        {
          trackId: 1002,
          trackName: "Episode 2",
          kind: "podcast-episode",
          releaseDate: "2024-01-22",
        },
        {
          trackId: 1003,
          trackName: "Episode 3",
          kind: "podcast-episode",
          releaseDate: "2024-01-29",
        },
      ] as unknown as PodcastDetailResult[];

      const podcastDetail = PodcastDetailEntity.fromApiResponse(apiResults);

      expect(podcastDetail.episodes).toHaveLength(3);
    });
  });

  describe("getEpisodeCount", () => {
    it("should return correct episode count", () => {
      const episodes = [
        { id: 1, title: "Episode 1", releaseDate: "2024-01-15" },
        { id: 2, title: "Episode 2", releaseDate: "2024-01-22" },
      ];

      const podcastDetail = new PodcastDetailEntity(
        123,
        "Podcast",
        "Artist",
        "image.jpg",
        "Description",
        episodes
      );

      expect(podcastDetail.getEpisodeCount()).toBe(2);
    });

    it("should return zero for empty episodes", () => {
      const podcastDetail = new PodcastDetailEntity(
        124,
        "Podcast",
        "Artist",
        "image.jpg",
        "Description",
        []
      );

      expect(podcastDetail.getEpisodeCount()).toBe(0);
    });
  });
});
