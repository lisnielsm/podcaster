import { GetPodcastDetailUseCase } from "./GetPodcastDetailUseCase";
import { Episode } from "../models/Episode";

export class GetEpisodeDetailUseCase {
  constructor(private getPodcastDetailUseCase: GetPodcastDetailUseCase) {}

  async execute(podcastId: string, episodeId: string): Promise<Episode | null> {
    try {
      // Obtain the complete podcast detail (that includes all episodes)
      const podcastDetail = await this.getPodcastDetailUseCase.execute(
        podcastId
      );

      // Find the specific episode
      const episode = podcastDetail.episodes.find(
        (ep) => ep.id === parseInt(episodeId, 10)
      );

      return episode || null;
    } catch (error) {
      console.error("Error fetching episode detail:", error);
      throw error;
    }
  }
}
