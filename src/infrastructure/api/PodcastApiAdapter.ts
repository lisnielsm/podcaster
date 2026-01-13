import { IPodcastRepository } from "../../core/domain/repositories/IPodcastRepository";
import { Podcast, PodcastEntity } from "../../core/domain/models/Podcast";
import { ItunesTopPodcastsResponse } from "../../core/domain/models/ApiTypes";
import { HttpClient } from "../http/HttpClient";

export class PodcastApiAdapter implements IPodcastRepository {
  private httpClient: HttpClient;
  private readonly TOP_PODCASTS_URL =
    "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";

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
}
