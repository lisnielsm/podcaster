import { Podcast } from "../models/Podcast";

export interface IPodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>;
}
