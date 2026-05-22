export const queryKeys = {
  authUser: ['auth', 'me'] as const,
  profile: ['users', 'profile'] as const,
  workoutList: (page = 1, limit = 10) => ['workouts', 'list', page, limit] as const,
  workoutDetail: (id: string) => ['workouts', 'detail', id] as const,
  workoutStats: ['workouts', 'stats'] as const,
  last30Days: ['workouts', 'last-30-days'] as const,
};
