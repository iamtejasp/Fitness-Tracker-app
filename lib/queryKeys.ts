import { WorkoutQuery } from '@/types/api';

export const queryKeys = {
  authUser: ['auth', 'me'] as const,
  profile: ['users', 'profile'] as const,
  workoutList: (query: WorkoutQuery = {}) =>
    [
      'workouts',
      'list',
      query.page ?? 1,
      query.limit ?? 10,
      query.search ?? '',
      query.exercise ?? '',
      query.from ?? '',
      query.to ?? '',
    ] as const,
  workoutInfiniteList: (query: Omit<WorkoutQuery, 'page'> = {}) =>
    [
      'workouts',
      'infinite-list',
      query.limit ?? 20,
      query.search ?? '',
      query.exercise ?? '',
      query.from ?? '',
      query.to ?? '',
    ] as const,
  workoutDetail: (id: string) => ['workouts', 'detail', id] as const,
  workoutStats: ['workouts', 'stats'] as const,
  last30Days: ['workouts', 'last-30-days'] as const,
  coachHistory: (page = 1, limit = 50) =>
    ['ai', 'coach-history', page, limit] as const,
};
