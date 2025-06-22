export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (key: string) => string;
}

// Re-export exercise types from local data
export type { ExerciseCategory, Exercise } from "../data/exercises";

// Exercise and Training Types
export interface ExerciseSet {
  setNumber: number;
  weight: number;
  reps: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  notes?: string;
  startTime: number;
  endTime?: number;
}

export interface TrainingExercise {
  exerciseId: number;
  exerciseName: string;
  category: string;
  sets: ExerciseSet[];
  notes?: string;
  additionalInfo?: string;
}

export interface TrainingSession {
  id: number;
  user_id: number;
  session_name: string;
  session_data: any;
  status: "active" | "completed" | "cancelled";
  start_time: string;
  end_time?: string;
  total_time: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplate {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  template_data: {
    exercises: {
      exerciseId: number;
      exerciseName: string;
      category: string;
      defaultSets: number;
      defaultReps: number;
      defaultWeight?: number;
      notes?: string;
    }[];
    estimatedDuration: number;
    difficulty: string;
  };
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserExerciseRecord {
  id: number;
  user_id: number;
  exercise_id: number;
  max_weight: number | null;
  max_reps: number | null;
  max_duration: number | null; // in seconds
  last_performed: string | null;
  total_sessions: number;
  personal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingGoal {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  goal_type: "weight" | "reps" | "duration" | "frequency" | "custom";
  target_value: number | null;
  current_value: number;
  target_date: string | null;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  language: "en" | "he";
  timezone: string;
  weight_unit: "kg" | "lbs";
  distance_unit: "km" | "miles";
  notifications_enabled: boolean;
  email_notifications: boolean;
  theme: "light" | "dark" | "auto";
  created_at: string;
  updated_at: string;
}

// Legacy types for backward compatibility
export interface ExerciseData {
  category: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

export interface WorkoutData {
  startTime: number;
  endTime: number;
  duration: number;
  exercises: ExerciseData[];
}

export interface ExerciseRecord {
  lastMaxWeight: number;
  lastPerformanceDate: Date;
  category: string;
  additionalInfo: string;
}

export interface WorkoutHistoryItem {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  exercises: (ExerciseData & {
    sets: (ExerciseSet & {
      startTime: Date;
      endTime: Date;
    })[];
  })[];
}
