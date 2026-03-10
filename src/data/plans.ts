import { WorkoutPlan } from '@/types';

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'abc_beginner',
    name: 'ABC Clássico (Iniciante)',
    description: 'Divisão clássica de 3 dias para iniciantes ou retorno aos treinos. Foco em construir base.',
    level: 'beginner',
    split: [
      {
        day: 'Treino A (Empurrar)',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        exercises: ['chest_press_flat', 'chest_press_inc', 'shoulder_press', 'lateral_raise', 'tricep_pushdown']
      },
      {
        day: 'Treino B (Puxar)',
        muscleGroups: ['back', 'biceps', 'abs'],
        exercises: ['lat_pulldown', 'row_machine', 'bicep_curl_bar', 'hammer_curl', 'plank']
      },
      {
        day: 'Treino C (Pernas)',
        muscleGroups: ['legs_quads', 'legs_hams', 'calves'],
        exercises: ['squat', 'leg_press', 'leg_extension', 'stiff', 'leg_curl']
      }
    ]
  },
  {
    id: 'abcde_advanced',
    name: 'ABCDE (Avançado)',
    description: 'Divisão de alto volume focando em um grupo muscular principal por dia. Ideal para quem treina 5x na semana.',
    level: 'advanced',
    split: [
      {
        day: 'A - Peito',
        muscleGroups: ['chest', 'abs'],
        exercises: ['chest_press_flat', 'chest_press_inc', 'chest_fly', 'crossover', 'crunches']
      },
      {
        day: 'B - Costas',
        muscleGroups: ['back'],
        exercises: ['pull_up', 'lat_pulldown', 'row_bent_over', 'row_machine']
      },
      {
        day: 'C - Pernas (Foco Quadríceps)',
        muscleGroups: ['legs_quads', 'calves'],
        exercises: ['squat', 'leg_press', 'leg_extension']
      },
      {
        day: 'D - Ombros',
        muscleGroups: ['shoulders'],
        exercises: ['shoulder_press', 'lateral_raise', 'front_raise', 'face_pull']
      },
      {
        day: 'E - Braços e Posterior',
        muscleGroups: ['biceps', 'triceps', 'legs_hams'],
        exercises: ['bicep_curl_bar', 'tricep_pushdown', 'skullcrusher', 'stiff', 'leg_curl']
      }
    ]
  }
];
