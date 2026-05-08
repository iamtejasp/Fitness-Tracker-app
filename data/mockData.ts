import { Exercise, User, Workout, WorkoutStats } from '@/types/api';

export const currentUser: User = {
  id: 'u_01',
  name: 'Tejas',
  email: 'tejas@example.com',
};

export const stats: WorkoutStats = {
  totalWorkouts: 47,
  workoutsThisWeek: 4,
  mostFrequentExercise: 'Bench Press',
};

export const workouts: Workout[] = [
  {
    id: 'w_01',
    date: '2026-05-08',
    createdAt: '2026-05-08T07:15:00.000Z',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 82.5 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 28 },
      { name: 'Tricep Rope Pushdown', sets: 3, reps: 12, weight: 35 },
    ],
  },
  {
    id: 'w_02',
    date: '2026-05-06',
    createdAt: '2026-05-06T06:45:00.000Z',
    exercises: [
      { name: 'Squat', sets: 5, reps: 5, weight: 110 },
      { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: 92.5 },
      { name: 'Walking Lunges', sets: 3, reps: 12, weight: 20 },
    ],
  },
  {
    id: 'w_03',
    date: '2026-05-04',
    createdAt: '2026-05-04T07:00:00.000Z',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 145 },
      { name: 'Pull-ups', sets: 4, reps: 8, weight: 0 },
      { name: 'Barbell Row', sets: 3, reps: 10, weight: 72.5 },
    ],
  },
  {
    id: 'w_04',
    date: '2026-05-02',
    createdAt: '2026-05-02T08:05:00.000Z',
    exercises: [
      { name: 'Shoulder Press', sets: 4, reps: 7, weight: 50 },
      { name: 'Lateral Raise', sets: 4, reps: 14, weight: 12 },
      { name: 'Face Pull', sets: 3, reps: 15, weight: 28 },
    ],
  },
];

export const suggestedExercises: Exercise[] = [
  { name: 'Bench Press', sets: 4, reps: 8, weight: 82.5 },
  { name: 'Squat', sets: 5, reps: 5, weight: 110 },
  { name: 'Deadlift', sets: 4, reps: 5, weight: 145 },
];

export const progressBars = [
  { label: 'Mon', value: 0.72 },
  { label: 'Tue', value: 0.38 },
  { label: 'Wed', value: 0.88 },
  { label: 'Thu', value: 0.54 },
  { label: 'Fri', value: 0.94 },
  { label: 'Sat', value: 0.42 },
  { label: 'Sun', value: 0.24 },
];

export const exerciseDistribution = [
  { label: 'Push', value: 42, color: '#7CFF6B' },
  { label: 'Legs', value: 31, color: '#FF775C' },
  { label: 'Pull', value: 27, color: '#5AD7FF' },
];

export const chatMessages = [
  {
    id: 'm_01',
    role: 'assistant' as const,
    text: 'Your bench has held around 80-82.5kg for three weeks. Try adding one extra rep per set before increasing load.',
  },
  {
    id: 'm_02',
    role: 'user' as const,
    text: 'How can I improve my bench press?',
  },
  {
    id: 'm_03',
    role: 'assistant' as const,
    text: 'Use 4x8 at 82.5kg this week, then aim for 4x9 next week. Add paused reps on your last set and keep shoulder work light before push day.',
  },
];

export const imageUrls = {
  onboardingTrack:
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  onboardingProgress:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
  onboardingCoach:
    'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=80',
  dashboard:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  avatar:
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
};
