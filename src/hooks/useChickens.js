import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  subscribeToChickens,
  addChicken,
  updateChicken,
  deleteChicken
} from '../api/chickenApi';

/**
 * Hook for managing chicken data
 * @param {string} farmId
 * @returns {Object} Chicken data and operations
 */
export const useChickens = farmId => {
  const queryClient = useQueryClient();

  const chickensQuery = useQuery({
    queryKey: ['chickens', farmId],
    queryFn: () =>
      new Promise(resolve => {
        const unsubscribe = subscribeToChickens(farmId, data => {
          resolve(data);
        });
        return () => unsubscribe();
      }),
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });

  const addChickenMutation = useMutation({
    mutationFn: chickenData => addChicken(farmId, chickenData),
    onSuccess: () => {
      queryClient.invalidateQueries(['chickens', farmId]);
    }
  });

  const updateChickenMutation = useMutation({
    mutationFn: ({ chickenId, chickenData }) =>
      updateChicken(farmId, chickenId, chickenData),
    onSuccess: () => {
      queryClient.invalidateQueries(['chickens', farmId]);
    }
  });

  const deleteChickenMutation = useMutation({
    mutationFn: chickenId => deleteChicken(farmId, chickenId),
    onSuccess: () => {
      queryClient.invalidateQueries(['chickens', farmId]);
    }
  });

  return {
    chickens: chickensQuery.data,
    isLoading: chickensQuery.isLoading,
    error: chickensQuery.error,
    addChicken: addChickenMutation.mutate,
    updateChicken: updateChickenMutation.mutate,
    deleteChicken: deleteChickenMutation.mutate
  };
};
