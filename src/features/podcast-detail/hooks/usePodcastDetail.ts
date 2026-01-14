import { useState, useEffect } from "react";
import { PodcastDetail } from "../../../core/domain/models/PodcastDetail";
import { GetPodcastDetailUseCase } from "../../../core/domain/services/GetPodcastDetailUseCase";

export const usePodcastDetail = (
  podcastId: string,
  getPodcastDetailUseCase: GetPodcastDetailUseCase
) => {
  const [podcastDetail, setPodcastDetail] = useState<PodcastDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadPodcastDetail();
  }, [podcastId]);

  const loadPodcastDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPodcastDetailUseCase.execute(podcastId);
      setPodcastDetail(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading podcast detail";
      setError(errorMessage);
      console.error("Error loading podcast detail:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    podcastDetail,
    loading,
    error,
  };
};
