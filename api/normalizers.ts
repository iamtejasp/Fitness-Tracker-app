import { User, Workout } from '@/types/api';

export function normalizeUser(user: User): User {
  return {
    ...user,
    id: user.id ?? user._id ?? '',
  };
}

export function normalizeWorkout(workout: Workout): Workout {
  return {
    ...workout,
    id: workout.id ?? workout._id ?? '',
  };
}
