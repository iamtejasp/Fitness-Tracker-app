import { axiosInstance } from './axiosInstance';
import { normalizeWorkout } from './normalizers';
import {
  CreateWorkoutRequest,
  PaginatedWorkouts,
  UpdateWorkoutRequest,
  Workout,
  WorkoutQuery,
  WorkoutStats,
} from '@/types/api';

export async function getWorkouts(query: WorkoutQuery = {}): Promise<PaginatedWorkouts> {
  const { data } = await axiosInstance.get<PaginatedWorkouts>('/workouts', {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      exercise: query.exercise,
      from: query.from,
      to: query.to,
    },
  });

  return {
    ...data,
    data: data.data.map(normalizeWorkout),
  };
}

export async function createWorkout(payload: CreateWorkoutRequest): Promise<Workout> {
  const { data } = await axiosInstance.post<Workout>('/workouts', payload);

  return normalizeWorkout(data);
}

export async function getWorkoutById(id: string): Promise<Workout> {
  const { data } = await axiosInstance.get<Workout>(`/workouts/${id}`);

  return normalizeWorkout(data);
}

export async function updateWorkout(id: string, payload: UpdateWorkoutRequest): Promise<Workout> {
  const { data } = await axiosInstance.patch<Workout>(`/workouts/${id}`, payload);

  return normalizeWorkout(data);
}

export async function deleteWorkout(id: string): Promise<void> {
  await axiosInstance.delete(`/workouts/${id}`);
}

export async function getLast30DaysWorkouts(): Promise<Workout[]> {
  const { data } = await axiosInstance.get<Workout[]>('/workouts/last-30-days');

  return data.map(normalizeWorkout);
}

export async function getWorkoutStats(): Promise<WorkoutStats> {
  const { data } = await axiosInstance.get<WorkoutStats>('/workouts/stats');

  return data;
}
