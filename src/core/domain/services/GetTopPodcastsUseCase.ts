import { IPodcastRepository } from "../repositories/IPodcastRepository";
import { IStorageRepository } from "../repositories/IStorageRepository";
import { Podcast } from "../models/Podcast";

interface CachedPodcasts {
  data: Podcast[];
  timestamp: number;
}

export class GetTopPodcastsUseCase {
  private readonly CACHE_KEY = "top_podcasts";
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 día en milisegundos

  constructor(
    private podcastRepository: IPodcastRepository,
    private storageRepository: IStorageRepository
  ) {}

  async execute(): Promise<Podcast[]> {
    // Try to get data from cache
    const cached = this.storageRepository.get<CachedPodcasts>(this.CACHE_KEY);

    // Check if the cache is valid (less than 1 day)
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log("Using cached podcasts");
      return cached.data;
    }

    // If there is no valid cache, get from the API
    console.log("Fetching podcasts from API");
    const podcasts = await this.podcastRepository.getTopPodcasts();

    // Save in cache
    this.storageRepository.set<CachedPodcasts>(this.CACHE_KEY, {
      data: podcasts,
      timestamp: Date.now(),
    });

    return podcasts;
  }

  private isCacheValid(timestamp: number): boolean {
    const now = Date.now();
    return now - timestamp < this.CACHE_DURATION;
  }
}
