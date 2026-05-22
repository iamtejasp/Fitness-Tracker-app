import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createWorkout,
  deleteWorkout,
  getLast30DaysWorkouts,
  getWorkoutById,
  getWorkouts,
  getWorkoutStats,
  updateWorkout,
} from '@/api/workouts.api';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { CreateWorkoutRequest, UpdateWorkoutRequest } from '@/types/api';

function invalidateWorkoutQueries() {
  queryClient.invalidateQueries({ queryKey: ['workouts'] });
}

export function useWorkoutsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.workoutList(page, limit),
    queryFn: () => getWorkouts({ page, limit }),
  });
}

export function useWorkoutQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.workoutDetail(id),
    queryFn: () => getWorkoutById(id),
    enabled: Boolean(id),
  });
}

export function useWorkoutStatsQuery() {
  return useQuery({
    queryKey: queryKeys.workoutStats,
    queryFn: getWorkoutStats,
  });
}

export function useLast30DaysWorkoutsQuery() {
  return useQuery({
    queryKey: queryKeys.last30Days,
    queryFn: getLast30DaysWorkouts,
  });
}

export function useCreateWorkoutMutation() {
  return useMutation({
    mutationFn: (payload: CreateWorkoutRequest) => createWorkout(payload),
    onSuccess: invalidateWorkoutQueries,
  });
}

export function useUpdateWorkoutMutation(id: string) {
  return useMutation({
    mutationFn: (payload: UpdateWorkoutRequest) => updateWorkout(id, payload),
    onSuccess: (workout) => {
      queryClient.setQueryData(queryKeys.workoutDetail(id), workout);
      invalidateWorkoutQueries();
    },
  });
}

export function useDeleteWorkoutMutation() {
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: invalidateWorkoutQueries,
  });
}
