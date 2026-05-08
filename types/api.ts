export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  createdAt: string;
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
