import { PodcastApiAdapter } from "../infrastructure/api/PodcastApiAdapter";
import { LocalStorageAdapter } from "../infrastructure/storage/LocalStorageAdapter";
import { HttpClient } from "../infrastructure/http/HttpClient";
import { GetTopPodcastsUseCase } from "../core/domain/services/GetTopPodcastsUseCase";

// Create instances
const httpClient = new HttpClient();
const podcastRepository = new PodcastApiAdapter(httpClient);
const storageRepository = new LocalStorageAdapter();

// Create use cases
export const getTopPodcastsUseCase = new GetTopPodcastsUseCase(
  podcastRepository,
  storageRepository
);

// Export for use in the application
export const diContainer = {
  getTopPodcastsUseCase,
  // Add more use cases here
};
