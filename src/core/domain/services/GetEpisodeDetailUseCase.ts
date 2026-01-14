import { GetPodcastDetailUseCase } from "./GetPodcastDetailUseCase";
import { Episode } from "../models/Episode";

export class GetEpisodeDetailUseCase {
  constructor(private getPodcastDetailUseCase: GetPodcastDetailUseCase) {}

  async execute(podcastId: string, episodeId: string): Promise<Episode | null> {
    try {
      // Obtener el detalle completo del podcast (que incluye todos los episodios)
      const podcastDetail = await this.getPodcastDetailUseCase.execute(
        podcastId
      );

      // Buscar el episodio específico
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
