import { Podcast } from "../models/Podcast";
import { PodcastDetail } from "../models/PodcastDetail";

export interface IPodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>;
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}
