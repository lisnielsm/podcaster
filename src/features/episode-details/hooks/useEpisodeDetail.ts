import { useState, useEffect } from "react";
import { Episode } from "../../../core/domain/models/Episode";
import { PodcastDetail } from "../../../core/domain/models/PodcastDetail";
import { GetEpisodeDetailUseCase } from "../../../core/domain/services/GetEpisodeDetailUseCase";
import { GetPodcastDetailUseCase } from "../../../core/domain/services/GetPodcastDetailUseCase";

export const useEpisodeDetail = (
  podcastId: string,
  episodeId: string,
  getEpisodeDetailUseCase: GetEpisodeDetailUseCase,
  getPodcastDetailUseCase: GetPodcastDetailUseCase
) => {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadEpisodeDetail();
  }, [podcastId, episodeId]);

  const loadEpisodeDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar el podcast completo para obtener información del sidebar
      const podcastData = await getPodcastDetailUseCase.execute(podcastId);
      setPodcast(podcastData);

      // Cargar el episodio específico
      const episodeData = await getEpisodeDetailUseCase.execute(
        podcastId,
        episodeId
      );

      if (!episodeData) {
        setError("Episode not found");
        return;
      }

      setEpisode(episodeData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading episode detail";
      setError(errorMessage);
      console.error("Error loading episode detail:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    episode,
    podcast,
    loading,
    error,
  };
};
