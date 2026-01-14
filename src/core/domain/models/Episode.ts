import { PodcastDetailResult } from "./ApiTypes";

export interface Episode {
  id: number;
  title: string;
  description?: string;
  releaseDate: string;
  duration?: number;
  episodeUrl?: string;
}

export class EpisodeEntity implements Episode {
  constructor(
    public id: number,
    public title: string,
    public description: string | undefined,
    public releaseDate: string,
    public duration: number | undefined,
    public episodeUrl: string | undefined
  ) {}

  static fromApiResponse(data: PodcastDetailResult): EpisodeEntity {
    return new EpisodeEntity(
      data.trackId,
      data.trackName,
      data.description || data.shortDescription,
      data.releaseDate,
      data.trackTimeMillis,
      data.episodeUrl
    );
  }

  getDurationFormatted(): string {
    if (!this.duration) return "--:--";

    const totalSeconds = Math.floor(this.duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  getReleaseDateFormatted(): string {
    const date = new Date(this.releaseDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
}
