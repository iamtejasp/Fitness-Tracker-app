import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
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
import { CreateWorkoutRequest, UpdateWorkoutRequest, WorkoutQuery } from '@/types/api';

function invalidateWorkoutQueries() {
  queryClient.invalidateQueries({ queryKey: ['workouts'] });
}

export function useWorkoutsQuery(pageOrQuery: number | WorkoutQuery = 1, limit = 10) {
  const query =
    typeof pageOrQuery === 'number'
      ? { page: pageOrQuery, limit }
      : { page: 1, limit: 10, ...pageOrQuery };

  return useQuery({
    queryKey: queryKeys.workoutList(query),
    queryFn: () => getWorkouts(query),
  });
}

export function useInfiniteWorkoutsQuery(query: Omit<WorkoutQuery, 'page'> = {}) {
  const normalizedQuery = { limit: 20, ...query };

  return useInfiniteQuery({
    queryKey: queryKeys.workoutInfiniteList(normalizedQuery),
    queryFn: ({ pageParam }) => getWorkouts({ ...normalizedQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
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
