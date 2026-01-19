import { EpisodeEntity } from "../Episode";
import { PodcastDetailResult } from "../ApiTypes";

describe("EpisodeEntity", () => {
  describe("constructor", () => {
    it("should create an episode with all properties", () => {
      const episode = new EpisodeEntity(
        101,
        "Test Episode",
        "Test description",
        "2024-01-15T00:00:00Z",
        3600000,
        "https://example.com/episode.mp3"
      );

      expect(episode.id).toBe(101);
      expect(episode.title).toBe("Test Episode");
      expect(episode.description).toBe("Test description");
      expect(episode.releaseDate).toBe("2024-01-15T00:00:00Z");
      expect(episode.duration).toBe(3600000);
      expect(episode.episodeUrl).toBe("https://example.com/episode.mp3");
    });

    it("should create an episode with undefined optional properties", () => {
      const episode = new EpisodeEntity(
        102,
        "Minimal Episode",
        undefined,
        "2024-01-15T00:00:00Z",
        undefined,
        undefined
      );

      expect(episode.description).toBeUndefined();
      expect(episode.duration).toBeUndefined();
      expect(episode.episodeUrl).toBeUndefined();
    });
  });

  describe("fromApiResponse", () => {
    it("should create episode from API response with description", () => {
      const apiResponse = {
        trackId: 201,
        trackName: "API Episode",
        description: "API description",
        releaseDate: "2024-02-01T00:00:00Z",
        trackTimeMillis: 1800000,
        episodeUrl: "https://example.com/api-ep.mp3",
        kind: "podcast-episode",
      } as PodcastDetailResult;

      const episode = EpisodeEntity.fromApiResponse(apiResponse);

      expect(episode.id).toBe(201);
      expect(episode.title).toBe("API Episode");
      expect(episode.description).toBe("API description");
      expect(episode.releaseDate).toBe("2024-02-01T00:00:00Z");
      expect(episode.duration).toBe(1800000);
      expect(episode.episodeUrl).toBe("https://example.com/api-ep.mp3");
    });

    it("should use shortDescription when description is not available", () => {
      const apiResponse = {
        trackId: 202,
        trackName: "Short Desc Episode",
        shortDescription: "Short description",
        releaseDate: "2024-02-01T00:00:00Z",
        kind: "podcast-episode",
      } as PodcastDetailResult;

      const episode = EpisodeEntity.fromApiResponse(apiResponse);

      expect(episode.description).toBe("Short description");
    });

    it("should prefer description over shortDescription", () => {
      const apiResponse = {
        trackId: 203,
        trackName: "Both Desc Episode",
        description: "Full description",
        shortDescription: "Short description",
        releaseDate: "2024-02-01T00:00:00Z",
        kind: "podcast-episode",
      } as PodcastDetailResult;

      const episode = EpisodeEntity.fromApiResponse(apiResponse);

      expect(episode.description).toBe("Full description");
    });
  });

  describe("getDurationFormatted", () => {
    it("should format duration with hours correctly", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15",
        3661000, // 1:01:01
        undefined
      );

      expect(episode.getDurationFormatted()).toBe("1:01:01");
    });

    it("should format duration without hours correctly", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15",
        1830000, // 30:30
        undefined
      );

      expect(episode.getDurationFormatted()).toBe("30:30");
    });

    it("should return '--:--' when duration is undefined", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15",
        undefined,
        undefined
      );

      expect(episode.getDurationFormatted()).toBe("--:--");
    });

    it("should pad minutes and seconds with zeros", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15",
        7265000, // 2:01:05
        undefined
      );

      expect(episode.getDurationFormatted()).toBe("2:01:05");
    });

    it("should handle zero duration", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15",
        0,
        undefined
      );

      expect(episode.getDurationFormatted()).toBe("--:--");
    });

    it("should format short duration correctly", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15",
        65000, // 1:05
        undefined
      );

      expect(episode.getDurationFormatted()).toBe("1:05");
    });
  });

  describe("getReleaseDateFormatted", () => {
    it("should format date in MM/DD/YYYY format", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-01-15T00:00:00Z",
        undefined,
        undefined
      );

      expect(episode.getReleaseDateFormatted()).toBe("01/15/2024");
    });

    it("should handle different months", () => {
      const episode = new EpisodeEntity(
        1,
        "Test",
        undefined,
        "2024-12-25T00:00:00Z",
        undefined,
        undefined
      );

      expect(episode.getReleaseDateFormatted()).toBe("12/25/2024");
    });
  });
});
