import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { api, ApiResponse } from '@/lib/axios';
import { PredictionProp } from '@/types';

const LIMIT = 10;

export const usePrediction = () => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [predictions, setPredictions] = useState<PredictionProp[]>([]);
  const [error, setError] = useState<string | null>(null);

  const predictionsRef = useRef(predictions);
  predictionsRef.current = predictions;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<PredictionProp[]>>(`/api/predictions?page=${page}&limit=${LIMIT}`);
      const newData = response.data.data;

      if (newData.length < LIMIT) {
        setHasMore(false);
      }

      setPredictions(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewData = newData.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNewData];
      });
    } catch (error) {
      const message =
        error instanceof AxiosError ? (error.response?.data?.message ?? 'Failed to fetch predictions') : null;
      setError(message);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  const updatePredictions = useCallback((data: PredictionProp) => {
    setPredictions(prev => {
      if (prev.some(p => p.id === data.id)) return prev;
      return [data, ...prev];
    });
  }, []);

  const submitBet = useCallback(async (predictionId: string, side: 'in' | 'out') => {
    const previousPredictions = predictionsRef.current;
    setPredictions(prev => prev.map(p =>
      p.id === predictionId
        ? { ...p, userBetSide: side, participants: p.participants + 1 }
        : p
    ));

    try {
      const response = await api.post<ApiResponse<PredictionProp>>(`/api/predictions/${predictionId}/bet`, { side });
      toast.success(response.data.message);
    } catch (error) {
      setPredictions(previousPredictions);
      const message = error instanceof AxiosError
        ? (error.response?.data?.error ?? 'Failed to submit bet')
        : 'Failed to submit bet';
      toast.error(message);
    }
  }, []);

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { isLoading, isInitialLoad, error, predictions, updatePredictions, hasMore, fetchData, submitBet, loadMore };
};
