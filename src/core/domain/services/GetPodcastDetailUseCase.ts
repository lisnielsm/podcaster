import { IPodcastRepository } from "../repositories/IPodcastRepository";
import { IStorageRepository } from "../repositories/IStorageRepository";
import { PodcastDetail } from "../models/PodcastDetail";

interface CachedPodcastDetail {
  data: PodcastDetail;
  timestamp: number;
}

export class GetPodcastDetailUseCase {
  private readonly CACHE_KEY_PREFIX = "podcast_detail_";
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  constructor(
    private podcastRepository: IPodcastRepository,
    private storageRepository: IStorageRepository
  ) {}

  async execute(podcastId: string): Promise<PodcastDetail> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${podcastId}`;

    // Try to get data from cache
    const cached = this.storageRepository.get<CachedPodcastDetail>(cacheKey);

    // Check if the cache is valid (less than 1 day)
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.warn("Using cached podcast detail for:", podcastId);
      return cached.data;
    }

    // If there is no valid cache, get from the API
    console.warn("Fetching podcast detail from API for:", podcastId);
    const podcastDetail = await this.podcastRepository.getPodcastDetail(
      podcastId
    );

    // Save in cache
    this.storageRepository.set<CachedPodcastDetail>(cacheKey, {
      data: podcastDetail,
      timestamp: Date.now(),
    });

    return podcastDetail;
  }

  private isCacheValid(timestamp: number): boolean {
    const now = Date.now();
    return now - timestamp < this.CACHE_DURATION;
  }
}
