import { Episode, EpisodeEntity } from "./Episode";
import { PodcastDetailResult } from "./ApiTypes";

export interface PodcastDetail {
  id: number;
  name: string;
  artist: string;
  image: string;
  description?: string;
  episodes: Episode[];
}

export class PodcastDetailEntity implements PodcastDetail {
  constructor(
    public id: number,
    public name: string,
    public artist: string,
    public image: string,
    public description: string | undefined,
    public episodes: Episode[]
  ) {}

  static fromApiResponse(results: PodcastDetailResult[]): PodcastDetailEntity {
    // The first result is the podcast
    const podcastData = results[0];

    // The other results are the episodes
    const episodes = results
      .slice(1)
      .filter((result) => result.kind === "podcast-episode")
      .map((episode) => EpisodeEntity.fromApiResponse(episode));

    return new PodcastDetailEntity(
      podcastData.collectionId,
      podcastData.collectionName,
      podcastData.artistName || podcastData.collectionArtistName || "Unknown",
      podcastData.artworkUrl600 || podcastData.artworkUrl100 || "",
      podcastData.description,
      episodes
    );
  }

  getEpisodeCount(): number {
    return this.episodes.length;
  }
}
