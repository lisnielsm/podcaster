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
