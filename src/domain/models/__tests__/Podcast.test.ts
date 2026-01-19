import { PodcastEntity } from "../Podcast";
import { ItunesEntry } from "../ApiTypes";

describe("PodcastEntity", () => {
  describe("constructor", () => {
    it("should create a podcast with all properties", () => {
      const podcast = new PodcastEntity(
        "123",
        "Test Podcast",
        "Test Artist",
        "https://example.com/image.jpg",
        "Test summary"
      );

      expect(podcast.id).toBe("123");
      expect(podcast.name).toBe("Test Podcast");
      expect(podcast.artist).toBe("Test Artist");
      expect(podcast.image).toBe("https://example.com/image.jpg");
      expect(podcast.summary).toBe("Test summary");
    });

    it("should create a podcast with undefined summary", () => {
      const podcast = new PodcastEntity(
        "124",
        "No Summary Podcast",
        "Artist",
        "image.jpg",
        undefined
      );

      expect(podcast.summary).toBeUndefined();
    });
  });

  describe("fromApiResponse", () => {
    it("should create podcast from iTunes API response", () => {
      const itunesEntry = {
        id: { label: "456", attributes: { "im:id": "456" } },
        "im:name": { label: "iTunes Podcast" },
        "im:artist": { label: "iTunes Artist" },
        "im:image": [
          { label: "small.jpg" },
          { label: "medium.jpg" },
          { label: "large.jpg" },
        ],
        summary: { label: "iTunes summary" },
      } as ItunesEntry;

      const podcast = PodcastEntity.fromApiResponse(itunesEntry);

      expect(podcast.id).toBe("456");
      expect(podcast.name).toBe("iTunes Podcast");
      expect(podcast.artist).toBe("iTunes Artist");
      expect(podcast.image).toBe("large.jpg");
      expect(podcast.summary).toBe("iTunes summary");
    });

    it("should use first image when only one image is available", () => {
      const itunesEntry = {
        id: { label: "457", attributes: { "im:id": "457" } },
        "im:name": { label: "One Image Podcast" },
        "im:artist": { label: "Artist" },
        "im:image": [{ label: "only.jpg" }],
      } as ItunesEntry;

      const podcast = PodcastEntity.fromApiResponse(itunesEntry);

      expect(podcast.image).toBe("only.jpg");
    });

    it("should use third image (largest) when available", () => {
      const itunesEntry = {
        id: { label: "458", attributes: { "im:id": "458" } },
        "im:name": { label: "Multi Image Podcast" },
        "im:artist": { label: "Artist" },
        "im:image": [
          { label: "small.jpg" },
          { label: "medium.jpg" },
          { label: "large.jpg" },
        ],
      } as ItunesEntry;

      const podcast = PodcastEntity.fromApiResponse(itunesEntry);

      expect(podcast.image).toBe("large.jpg");
    });

    it("should handle missing summary", () => {
      const itunesEntry = {
        id: { label: "459", attributes: { "im:id": "459" } },
        "im:name": { label: "No Summary" },
        "im:artist": { label: "Artist" },
        "im:image": [{ label: "image.jpg" }],
      } as ItunesEntry;

      const podcast = PodcastEntity.fromApiResponse(itunesEntry);

      expect(podcast.summary).toBeUndefined();
    });

    it("should handle empty images array", () => {
      const itunesEntry = {
        id: { label: "460", attributes: { "im:id": "460" } },
        "im:name": { label: "No Images" },
        "im:artist": { label: "Artist" },
        "im:image": [],
      } as ItunesEntry;

      const podcast = PodcastEntity.fromApiResponse(itunesEntry);

      expect(podcast.image).toBe("");
    });
  });
});
