import { PodcastApiAdapter } from "../infrastructure/api/PodcastApiAdapter";
import { LocalStorageAdapter } from "../infrastructure/storage/LocalStorageAdapter";
import { HttpClient } from "../infrastructure/http/HttpClient";
import { GetTopPodcastsUseCase } from "../domain/services/GetTopPodcastsUseCase";
import { GetPodcastDetailUseCase } from "../domain/services/GetPodcastDetailUseCase";
import { GetEpisodeDetailUseCase } from "../domain/services/GetEpisodeDetailUseCase";

// Create instances
const httpClient = new HttpClient();
const podcastRepository = new PodcastApiAdapter(httpClient);
const storageRepository = new LocalStorageAdapter();

// Create use cases
export const getTopPodcastsUseCase = new GetTopPodcastsUseCase(
  podcastRepository,
  storageRepository
);

export const getPodcastDetailUseCase = new GetPodcastDetailUseCase(
  podcastRepository,
  storageRepository
);

export const getEpisodeDetailUseCase = new GetEpisodeDetailUseCase(
  getPodcastDetailUseCase
);

// Export for use in the application
export const diContainer = {
  getTopPodcastsUseCase,
  getPodcastDetailUseCase,
  getEpisodeDetailUseCase,
};
