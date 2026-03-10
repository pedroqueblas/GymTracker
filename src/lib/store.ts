import { create } from 'zustand';
import { WorkoutSession, ExerciseLog, WorkoutPlan } from '@/types';

interface RestTimerState {
  endTime: number | null; // Timestamp quando o descanso acaba
  duration: number; // Duração total em segundos
}

interface HydrationState {
  current: number; // in ml
  goal: number; // in ml
  lastUpdated: string; // ISO date string to reset daily
  history: string[]; // dates when goal was met
}

interface BodyWeightLog {
  date: string;
  weight: number;
}

interface AppState {
  activeWorkout: WorkoutSession | null;
  workoutHistory: WorkoutSession[];
  restTimer: RestTimerState;
  customPlans: WorkoutPlan[];
  hydration: HydrationState;
  bodyWeight: BodyWeightLog[];
  
  startWorkout: (name: string) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  
  addExerciseLog: (log: ExerciseLog) => void;
  updateExerciseLog: (logId: string, sets: { weight: number; reps: number; completed: boolean }[]) => void;
  
  addCardioLog: (cardio: NonNullable<WorkoutSession['cardio']>) => void;
  
  addCustomPlan: (plan: WorkoutPlan) => void;

  // Hydration Actions
  addWater: (amount: number) => void;
  setHydrationGoal: (goal: number) => void;
  checkHydrationDate: () => void;

  // Body Weight Actions
  addBodyWeight: (weight: number) => void;

  // Timer Actions
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  addTime: (seconds: number) => void;
  
  // Auth Actions
  resetState: () => void;
  setFullState: (state: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>()(
  (set) => ({
      activeWorkout: null,
      workoutHistory: [],
      restTimer: { endTime: null, duration: 120 },
      customPlans: [],
      hydration: { current: 0, goal: 2500, lastUpdated: new Date().toISOString(), history: [] },
      bodyWeight: [],

      resetState: () => set({
        activeWorkout: null,
        workoutHistory: [],
        restTimer: { endTime: null, duration: 120 },
        customPlans: [],
        hydration: { current: 0, goal: 2500, lastUpdated: new Date().toISOString(), history: [] },
        bodyWeight: []
      }),

      setFullState: (newState) => set((state) => ({ ...state, ...newState })),

      addWater: (amount) => set((state) => ({
        hydration: {
          ...state.hydration,
          current: state.hydration.current + amount,
          lastUpdated: new Date().toISOString()
        }
      })),

      setHydrationGoal: (goal) => set((state) => ({
        hydration: {
          ...state.hydration,
          goal
        }
      })),

      checkHydrationDate: () => set((state) => {
        const last = new Date(state.hydration.lastUpdated);
        const now = new Date();
        
        // Verifica se é um novo dia (depois das 00:00)
        const lastDay = last.getDate();
        const lastMonth = last.getMonth();
        const lastYear = last.getFullYear();
        
        const currentDay = now.getDate();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const isNewDay = currentYear > lastYear ||
                        currentMonth > lastMonth ||
                        currentDay > lastDay;
        
        if (isNewDay) {
          const metGoal = state.hydration.current >= state.hydration.goal;
          const newHistory = metGoal 
            ? [...(state.hydration.history || []), state.hydration.lastUpdated]
            : (state.hydration.history || []);

          return {
            hydration: {
              ...state.hydration,
              current: 0, // Zera o contador no novo dia
              lastUpdated: now.toISOString(),
              history: newHistory
            }
          };
        }
        return {};
      }),

      addBodyWeight: (weight) => set((state) => ({
        bodyWeight: [...state.bodyWeight, { date: new Date().toISOString(), weight }]
      })),

      startWorkout: (name) => set({
        activeWorkout: {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          name,
          exercises: [],
          durationMinutes: 0,
        }
      }),

      finishWorkout: () => set((state) => {
        if (!state.activeWorkout) return {};
        return {
          workoutHistory: [state.activeWorkout, ...state.workoutHistory],
          activeWorkout: null,
          restTimer: { endTime: null, duration: 120 }
        };
      }),

      cancelWorkout: () => set({ activeWorkout: null, restTimer: { endTime: null, duration: 120 } }),

      addExerciseLog: (log) => set((state) => {
        if (!state.activeWorkout) return {};
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [...state.activeWorkout.exercises, log]
          }
        };
      }),

      updateExerciseLog: (logId, sets) => set((state) => {
         if (!state.activeWorkout) return {};
         const updatedExercises = state.activeWorkout.exercises.map(ex => 
           ex.id === logId ? { ...ex, sets } : ex
         );
         return {
           activeWorkout: {
             ...state.activeWorkout,
             exercises: updatedExercises
           }
         };
      }),

      addCardioLog: (cardio) => set((state) => {
        if (!state.activeWorkout) return {};
        return {
          activeWorkout: {
            ...state.activeWorkout,
            cardio
          }
        };
      }),

      addCustomPlan: (plan) => set((state) => ({
        customPlans: [...state.customPlans, plan]
      })),

      startRestTimer: (seconds) => set({
        restTimer: {
          endTime: Date.now() + seconds * 1000,
          duration: seconds
        }
      }),

      stopRestTimer: () => set({
        restTimer: { endTime: null, duration: 120 }
      }),

      addTime: (seconds) => set((state) => {
        if (!state.restTimer.endTime) return {};
        return {
          restTimer: {
            ...state.restTimer,
            endTime: state.restTimer.endTime + (seconds * 1000)
          }
        };
      }),
    })
);
