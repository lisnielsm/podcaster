import { IPodcastRepository } from "../../core/domain/repositories/IPodcastRepository";
import { Podcast, PodcastEntity } from "../../core/domain/models/Podcast";
import {
  ItunesPodcastDetailResponse,
  ItunesTopPodcastsResponse,
} from "../../core/domain/models/ApiTypes";
import { HttpClient } from "../http/HttpClient";
import {
  PodcastDetail,
  PodcastDetailEntity,
} from "../../core/domain/models/PodcastDetail";

export class PodcastApiAdapter implements IPodcastRepository {
  private httpClient: HttpClient;
  private readonly TOP_PODCASTS_URL =
    "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";
  private readonly PODCAST_DETAIL_URL = "https://itunes.apple.com/lookup";

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getTopPodcasts(): Promise<Podcast[]> {
    try {
      const response = await this.httpClient.get<ItunesTopPodcastsResponse>(
        this.TOP_PODCASTS_URL
      );

      const entries = response.feed?.entry || [];

      return entries.map((entry) => PodcastEntity.fromApiResponse(entry));
    } catch (error) {
      console.error("Error fetching top podcasts:", error);
      throw new Error("Failed to fetch top podcasts");
    }
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    try {
      const url = `${this.PODCAST_DETAIL_URL}?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`;
      const response = await this.httpClient.get<ItunesPodcastDetailResponse>(
        url
      );

      if (!response.results || response.results.length === 0) {
        throw new Error("No podcast details found");
      }

      return PodcastDetailEntity.fromApiResponse(response.results);
    } catch (error) {
      console.error("Error fetching podcast detail:", error);
      throw new Error("Failed to fetch podcast detail");
    }
  }
}
