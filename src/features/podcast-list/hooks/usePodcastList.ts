import { useState, useEffect } from "react";
import { Podcast } from "../../../core/domain/models/Podcast";
import { GetTopPodcastsUseCase } from "../../../core/domain/services/GetTopPodcastsUseCase";

export const usePodcastList = (
  getTopPodcastsUseCase: GetTopPodcastsUseCase
) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadPodcasts();
  }, []);

  useEffect(() => {
    filterPodcasts();
  }, [filter, podcasts]);

  const loadPodcasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopPodcastsUseCase.execute();
      setPodcasts(data);
      setFilteredPodcasts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading podcasts";
      setError(errorMessage);
      console.error("Error loading podcasts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterPodcasts = () => {
    if (!filter.trim()) {
      setFilteredPodcasts(podcasts);
      return;
    }

    const lowerCaseFilter = filter.toLowerCase();
    const filtered = podcasts.filter(
      (podcast) =>
        podcast.name.toLowerCase().includes(lowerCaseFilter) ||
        podcast.artist.toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredPodcasts(filtered);
  };

  return {
    podcasts: filteredPodcasts,
    loading,
    error,
    filter,
    setFilter,
    totalCount: podcasts.length,
    filteredCount: filteredPodcasts.length,
  };
};
