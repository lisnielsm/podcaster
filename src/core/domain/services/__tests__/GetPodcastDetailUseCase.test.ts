import { GetPodcastDetailUseCase } from "../GetPodcastDetailUseCase";
import { IPodcastRepository } from "../../repositories/IPodcastRepository";
import { IStorageRepository } from "../../repositories/IStorageRepository";
import { PodcastDetail } from "../../models/PodcastDetail";

describe("GetPodcastDetailUseCase", () => {
  let useCase: GetPodcastDetailUseCase;
  let mockPodcastRepository: jest.Mocked<IPodcastRepository>;
  let mockStorageRepository: jest.Mocked<IStorageRepository>;

  const mockPodcastDetail: PodcastDetail = {
    id: 123,
    name: "Test Podcast",
    artist: "Test Artist",
    image: "image.jpg",
    description: "Test description",
    episodes: [
      {
        id: 1,
        title: "Episode 1",
        releaseDate: "2024-01-15",
        duration: 3600000,
      },
    ],
  };

  beforeEach(() => {
    mockPodcastRepository = {
      getTopPodcasts: jest.fn(),
      getPodcastDetail: jest.fn(),
    };

    mockStorageRepository = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    };

    useCase = new GetPodcastDetailUseCase(
      mockPodcastRepository,
      mockStorageRepository
    );

    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("execute", () => {
    it("should return cached data when cache is valid", async () => {
      const cachedData = {
        data: mockPodcastDetail,
        timestamp: Date.now() - 1000, // 1 second ago
      };
      mockStorageRepository.get.mockReturnValue(cachedData);

      const result = await useCase.execute("123");

      expect(result).toEqual(mockPodcastDetail);
      expect(mockPodcastRepository.getPodcastDetail).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        "Using cached podcast detail for:",
        "123"
      );
    });

    it("should fetch from API when no cache exists", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail
      );

      const result = await useCase.execute("123");

      expect(result).toEqual(mockPodcastDetail);
      expect(mockPodcastRepository.getPodcastDetail).toHaveBeenCalledWith(
        "123"
      );
      expect(console.warn).toHaveBeenCalledWith(
        "Fetching podcast detail from API for:",
        "123"
      );
    });

    it("should fetch from API when cache is expired", async () => {
      const expiredCache = {
        data: mockPodcastDetail,
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
      };
      mockStorageRepository.get.mockReturnValue(expiredCache);
      mockPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail
      );

      const result = await useCase.execute("123");

      expect(result).toEqual(mockPodcastDetail);
      expect(mockPodcastRepository.getPodcastDetail).toHaveBeenCalled();
    });

    it("should save data to cache after fetching from API", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail
      );

      await useCase.execute("123");

      expect(mockStorageRepository.set).toHaveBeenCalledWith(
        "podcast_detail_123",
        expect.objectContaining({
          data: mockPodcastDetail,
          timestamp: expect.any(Number),
        })
      );
    });

    it("should use podcast-specific cache key", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail
      );

      await useCase.execute("456");

      expect(mockStorageRepository.get).toHaveBeenCalledWith(
        "podcast_detail_456"
      );
      expect(mockStorageRepository.set).toHaveBeenCalledWith(
        "podcast_detail_456",
        expect.any(Object)
      );
    });

    it("should not save to cache when using cached data", async () => {
      const cachedData = {
        data: mockPodcastDetail,
        timestamp: Date.now(),
      };
      mockStorageRepository.get.mockReturnValue(cachedData);

      await useCase.execute("123");

      expect(mockStorageRepository.set).not.toHaveBeenCalled();
    });

    it("should consider cache valid just before 24 hours", async () => {
      const almostExpiredCache = {
        data: mockPodcastDetail,
        timestamp: Date.now() - 23 * 60 * 60 * 1000, // 23 hours ago
      };
      mockStorageRepository.get.mockReturnValue(almostExpiredCache);

      await useCase.execute("123");

      expect(mockPodcastRepository.getPodcastDetail).not.toHaveBeenCalled();
    });

    it("should handle different podcast IDs independently", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail
      );

      await useCase.execute("123");
      await useCase.execute("456");

      expect(mockStorageRepository.get).toHaveBeenCalledWith(
        "podcast_detail_123"
      );
      expect(mockStorageRepository.get).toHaveBeenCalledWith(
        "podcast_detail_456"
      );
    });
  });
});
