// Interfaces for the iTunes API response

export interface ItunesImageAttributes {
  height: string;
}

export interface ItunesImage {
  label: string;
  attributes: ItunesImageAttributes;
}

export interface ItunesName {
  label: string;
}

export interface ItunesArtist {
  label: string;
  attributes?: {
    href: string;
  };
}

export interface ItunesSummary {
  label: string;
}

export interface ItunesId {
  label: string;
  attributes: {
    "im:id": string;
  };
}

export interface ItunesEntry {
  "im:name": ItunesName;
  "im:image": ItunesImage[];
  "im:artist": ItunesArtist;
  summary?: ItunesSummary;
  id: ItunesId;
  title?: ItunesName;
  "im:releaseDate"?: ItunesName;
}

export interface ItunesFeed {
  entry: ItunesEntry[];
}

export interface ItunesTopPodcastsResponse {
  feed: ItunesFeed;
}

export interface PodcastDetailResult {
  wrapperType: string;
  kind: string;
  artistId?: number;
  collectionId: number;
  trackId: number;
  artistName?: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName?: string;
  trackCensoredName?: string;
  artistViewUrl?: string;
  collectionViewUrl: string;
  feedUrl?: string;
  trackViewUrl: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  collectionPrice?: number;
  trackPrice?: number;
  releaseDate: string;
  collectionExplicitness?: string;
  trackExplicitness?: string;
  trackCount?: number;
  trackTimeMillis?: number;
  country: string;
  currency?: string;
  primaryGenreName?: string;
  contentAdvisoryRating?: string;
  artworkUrl600?: string;
  genreIds?: string[];
  genres?: string[];
  episodeUrl?: string;
  closedCaptioning?: string;
  collectionArtistId?: number;
  collectionArtistName?: string;
  description?: string;
  shortDescription?: string;
  episodeGuid?: string;
  episodeFileExtension?: string;
  episodeContentType?: string;
}

export interface ItunesPodcastDetailResponse {
  resultCount: number;
  results: PodcastDetailResult[];
}
