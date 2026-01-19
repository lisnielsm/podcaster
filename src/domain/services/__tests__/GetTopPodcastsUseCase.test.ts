import { GetTopPodcastsUseCase } from "../GetTopPodcastsUseCase";
import { IPodcastRepository } from "../../repositories/IPodcastRepository";
import { IStorageRepository } from "../../repositories/IStorageRepository";
import { Podcast } from "../../models/Podcast";

describe("GetTopPodcastsUseCase", () => {
  let useCase: GetTopPodcastsUseCase;
  let mockPodcastRepository: jest.Mocked<IPodcastRepository>;
  let mockStorageRepository: jest.Mocked<IStorageRepository>;

  const mockPodcasts: Podcast[] = [
    {
      id: "1",
      name: "Podcast 1",
      artist: "Artist 1",
      image: "image1.jpg",
    },
    {
      id: "2",
      name: "Podcast 2",
      artist: "Artist 2",
      image: "image2.jpg",
    },
  ];

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

    useCase = new GetTopPodcastsUseCase(
      mockPodcastRepository,
      mockStorageRepository
    );

    jest.spyOn(console, "warn").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("execute", () => {
    it("should return cached data when cache is valid", async () => {
      const cachedData = {
        data: mockPodcasts,
        timestamp: Date.now() - 1000, // 1 second ago
      };
      mockStorageRepository.get.mockReturnValue(cachedData);

      const result = await useCase.execute();

      expect(result).toEqual(mockPodcasts);
      expect(mockPodcastRepository.getTopPodcasts).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith("Using cached podcasts");
    });

    it("should fetch from API when no cache exists", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getTopPodcasts.mockResolvedValue(mockPodcasts);

      const result = await useCase.execute();

      expect(result).toEqual(mockPodcasts);
      expect(mockPodcastRepository.getTopPodcasts).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith("Fetching podcasts from API");
    });

    it("should fetch from API when cache is expired", async () => {
      const expiredCache = {
        data: mockPodcasts,
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
      };
      mockStorageRepository.get.mockReturnValue(expiredCache);
      mockPodcastRepository.getTopPodcasts.mockResolvedValue(mockPodcasts);

      const result = await useCase.execute();

      expect(result).toEqual(mockPodcasts);
      expect(mockPodcastRepository.getTopPodcasts).toHaveBeenCalled();
    });

    it("should save data to cache after fetching from API", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getTopPodcasts.mockResolvedValue(mockPodcasts);

      await useCase.execute();

      expect(mockStorageRepository.set).toHaveBeenCalledWith(
        "top_podcasts",
        expect.objectContaining({
          data: mockPodcasts,
          timestamp: expect.any(Number),
        })
      );
    });

    it("should use correct cache key", async () => {
      mockStorageRepository.get.mockReturnValue(null);
      mockPodcastRepository.getTopPodcasts.mockResolvedValue([]);

      await useCase.execute();

      expect(mockStorageRepository.get).toHaveBeenCalledWith("top_podcasts");
    });

    it("should not save to cache when using cached data", async () => {
      const cachedData = {
        data: mockPodcasts,
        timestamp: Date.now(),
      };
      mockStorageRepository.get.mockReturnValue(cachedData);

      await useCase.execute();

      expect(mockStorageRepository.set).not.toHaveBeenCalled();
    });

    it("should consider cache valid just before 24 hours", async () => {
      const almostExpiredCache = {
        data: mockPodcasts,
        timestamp: Date.now() - 23 * 60 * 60 * 1000, // 23 hours ago
      };
      mockStorageRepository.get.mockReturnValue(almostExpiredCache);

      await useCase.execute();

      expect(mockPodcastRepository.getTopPodcasts).not.toHaveBeenCalled();
    });
  });
});
