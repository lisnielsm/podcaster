import { ItunesEntry } from "./ApiTypes";

export interface Podcast {
  id: string;
  name: string;
  artist: string;
  image: string;
  summary?: string;
}

export class PodcastEntity implements Podcast {
  constructor(
    public id: string,
    public name: string,
    public artist: string,
    public image: string,
    public summary?: string
  ) {}

  static fromApiResponse(data: ItunesEntry): PodcastEntity {
    return new PodcastEntity(
      data.id.attributes["im:id"],
      data["im:name"].label,
      data["im:artist"].label,
      data["im:image"][2]?.label || data["im:image"][0]?.label || "",
      data.summary?.label
    );
  }
}
