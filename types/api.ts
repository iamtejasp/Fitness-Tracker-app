export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  _id?: string;
  userId?: string;
  date: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  workoutsThisWeek: number;
  mostFrequentExercise: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CoachResponse {
  advice: string;
}

export interface PaginatedWorkouts {
  data: Workout[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface CreateWorkoutRequest {
  exercises: Exercise[];
  date?: string;
}

export interface UpdateWorkoutRequest {
  exercises?: Exercise[];
  date?: string;
}

export interface WorkoutQuery {
  page?: number;
  limit?: number;
}

export interface CoachRequest {
  message: string;
}
