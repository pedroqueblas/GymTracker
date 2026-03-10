export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'legs_quads' 
  | 'legs_hams' 
  | 'calves' 
  | 'biceps' 
  | 'triceps' 
  | 'abs' 
  | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description?: string;
  defaultSets?: number;
  defaultReps?: string; // "10-12" or "Falha"
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  sets: {
    weight: number;
    reps: number;
    completed: boolean;
  }[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO Date
  name: string; // "Treino A - Peito"
  exercises: ExerciseLog[];
  durationMinutes: number;
  cardio?: {
    type: 'treadmill' | 'bike' | 'stairs' | 'elliptical' | 'other';
    durationMinutes: number;
    distanceKm: number;
    intensity: 'low' | 'moderate' | 'high';
  };
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  split: {
    day: string; // "Segunda" or "Dia 1"
    muscleGroups: MuscleGroup[];
    exercises: string[]; // IDs of recommended exercises
  }[];
}
