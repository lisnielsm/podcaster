import { GetEpisodeDetailUseCase } from "../GetEpisodeDetailUseCase";
import { GetPodcastDetailUseCase } from "../GetPodcastDetailUseCase";
import { PodcastDetail } from "../../models/PodcastDetail";
import { EpisodeEntity } from "../../models/Episode";

describe("GetEpisodeDetailUseCase", () => {
  let useCase: GetEpisodeDetailUseCase;
  let mockGetPodcastDetailUseCase: jest.Mocked<GetPodcastDetailUseCase>;
  let mockExecute: jest.Mock;

  const mockEpisode1 = new EpisodeEntity(
    101,
    "Episode 1",
    "First episode",
    "2024-01-15",
    3600000,
    "https://example.com/ep1.mp3"
  );

  const mockEpisode2 = new EpisodeEntity(
    102,
    "Episode 2",
    "Second episode",
    "2024-01-22",
    1800000,
    "https://example.com/ep2.mp3"
  );

  const mockPodcastDetail: PodcastDetail = {
    id: 123,
    name: "Test Podcast",
    artist: "Test Artist",
    image: "image.jpg",
    description: "Test description",
    episodes: [mockEpisode1, mockEpisode2],
  };

  beforeEach(() => {
    mockExecute = jest.fn();
    mockGetPodcastDetailUseCase = {
      execute: mockExecute,
    } as unknown as jest.Mocked<GetPodcastDetailUseCase>;

    useCase = new GetEpisodeDetailUseCase(mockGetPodcastDetailUseCase);

    jest.spyOn(console, "error").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("execute", () => {
    it("should return episode when found", async () => {
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(mockPodcastDetail);

      const result = await useCase.execute("123", "101");

      expect(result).toEqual(mockEpisode1);
    });

    it("should call getPodcastDetailUseCase with correct podcast ID", async () => {
      mockExecute.mockResolvedValue(mockPodcastDetail);

      await useCase.execute("456", "101");

      expect(mockExecute).toHaveBeenCalledWith("456");
    });

    it("should return null when episode not found", async () => {
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(mockPodcastDetail);

      const result = await useCase.execute("123", "999");

      expect(result).toBeNull();
    });

    it("should parse episode ID as integer", async () => {
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(mockPodcastDetail);

      const result = await useCase.execute("123", "102");

      expect(result).toEqual(mockEpisode2);
    });

    it("should handle string episode ID", async () => {
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(mockPodcastDetail);

      const result = await useCase.execute("123", "101");

      expect(result?.id).toBe(101);
    });

    it("should throw error when podcast fetch fails", async () => {
      mockGetPodcastDetailUseCase.execute.mockRejectedValue(
        new Error("Podcast not found")
      );

      await expect(useCase.execute("123", "101")).rejects.toThrow(
        "Podcast not found"
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("should return null when podcast has no episodes", async () => {
      const emptyPodcast: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [],
      };
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(emptyPodcast);

      const result = await useCase.execute("123", "101");

      expect(result).toBeNull();
    });

    it("should find correct episode among many", async () => {
      const manyEpisodes: EpisodeEntity[] = Array.from(
        { length: 20 },
        (_, i) =>
          new EpisodeEntity(
            100 + i,
            `Episode ${i + 1}`,
            undefined,
            "2024-01-15",
            undefined,
            undefined
          )
      );
      const largePodcast: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: manyEpisodes,
      };
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(largePodcast);

      const result = await useCase.execute("123", "115");

      expect(result?.id).toBe(115);
      expect(result?.title).toBe("Episode 16");
    });

    it("should handle non-numeric episode ID", async () => {
      mockGetPodcastDetailUseCase.execute.mockResolvedValue(mockPodcastDetail);

      const result = await useCase.execute("123", "abc");

      expect(result).toBeNull();
    });
  });
});
