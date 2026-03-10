import { Exercise } from '@/types';

export const EXERCISES: Exercise[] = [
  // PEITO
  { id: 'chest_press_flat_bar', name: 'Supino Reto (Barra)', muscleGroup: 'chest', defaultSets: 4, defaultReps: '8-12' },
  { id: 'chest_press_flat_db', name: 'Supino Reto (Halteres)', muscleGroup: 'chest', defaultSets: 4, defaultReps: '8-12' },
  { id: 'chest_press_inc_bar', name: 'Supino Inclinado (Barra)', muscleGroup: 'chest', defaultSets: 4, defaultReps: '8-12' },
  { id: 'chest_press_inc_db', name: 'Supino Inclinado (Halteres)', muscleGroup: 'chest', defaultSets: 4, defaultReps: '10-12' },
  { id: 'chest_press_dec_bar', name: 'Supino Declinado (Barra)', muscleGroup: 'chest', defaultSets: 3, defaultReps: '10-12' },
  { id: 'chest_press_machine', name: 'Supino Máquina (Chest Press)', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },
  { id: 'chest_fly_machine', name: 'Crucifixo (Peck Deck/Máquina)', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },
  { id: 'chest_fly_db', name: 'Crucifixo (Halteres)', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },
  { id: 'crossover_high', name: 'Crossover Polia Alta', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },
  { id: 'crossover_mid', name: 'Crossover Polia Média', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },
  { id: 'crossover_low', name: 'Crossover Polia Baixa', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },
  { id: 'pushups', name: 'Flexão de Braço', muscleGroup: 'chest', defaultSets: 3, defaultReps: 'Falha' },
  { id: 'dips', name: 'Mergulho (Paralelas)', muscleGroup: 'chest', defaultSets: 3, defaultReps: '8-12' },
  { id: 'pullover_db', name: 'Pullover (Halter)', muscleGroup: 'chest', defaultSets: 3, defaultReps: '12-15' },

  // COSTAS
  { id: 'lat_pulldown_front', name: 'Puxada Alta (Frente/Aberta)', muscleGroup: 'back', defaultSets: 4, defaultReps: '8-12' },
  { id: 'lat_pulldown_close', name: 'Puxada Alta (Triângulo/Fechada)', muscleGroup: 'back', defaultSets: 4, defaultReps: '8-12' },
  { id: 'lat_pulldown_supinated', name: 'Puxada Alta (Supinada)', muscleGroup: 'back', defaultSets: 4, defaultReps: '8-12' },
  { id: 'pull_up', name: 'Barra Fixa (Pronada)', muscleGroup: 'back', defaultSets: 3, defaultReps: 'Falha' },
  { id: 'chin_up', name: 'Barra Fixa (Supinada)', muscleGroup: 'back', defaultSets: 3, defaultReps: 'Falha' },
  { id: 'row_bent_over_bar', name: 'Remada Curvada (Barra)', muscleGroup: 'back', defaultSets: 4, defaultReps: '8-10' },
  { id: 'row_bent_over_db', name: 'Remada Curvada (Halteres)', muscleGroup: 'back', defaultSets: 4, defaultReps: '10-12' },
  { id: 'row_unilateral_db', name: 'Remada Unilateral (Serrote)', muscleGroup: 'back', defaultSets: 3, defaultReps: '10-12' },
  { id: 'row_machine', name: 'Remada Sentada (Máquina/Cabo)', muscleGroup: 'back', defaultSets: 3, defaultReps: '10-12' },
  { id: 'row_cavalinho', name: 'Remada Cavalinho', muscleGroup: 'back', defaultSets: 4, defaultReps: '8-12' },
  { id: 'pulldown_cable', name: 'Pulldown (Polia Alta)', muscleGroup: 'back', defaultSets: 3, defaultReps: '12-15' },
  { id: 'hyperextension', name: 'Hiperextensão Lombar', muscleGroup: 'back', defaultSets: 3, defaultReps: '15' },
  { id: 'deadlift', name: 'Levantamento Terra', muscleGroup: 'back', defaultSets: 3, defaultReps: '5-8' },

  // OMBROS
  { id: 'shoulder_press_db', name: 'Desenvolvimento (Halteres)', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: '8-12' },
  { id: 'shoulder_press_bar', name: 'Desenvolvimento (Barra/Militar)', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: '8-10' },
  { id: 'shoulder_press_machine', name: 'Desenvolvimento Máquina', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '10-12' },
  { id: 'lateral_raise_db', name: 'Elevação Lateral (Halteres)', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: '12-15' },
  { id: 'lateral_raise_cable', name: 'Elevação Lateral (Polia)', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: '12-15' },
  { id: 'front_raise_db', name: 'Elevação Frontal (Halteres)', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '12-15' },
  { id: 'front_raise_bar', name: 'Elevação Frontal (Barra)', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '12-15' },
  { id: 'reverse_fly_peck_deck', name: 'Crucifixo Inverso (Máquina)', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '12-15' },
  { id: 'face_pull', name: 'Face Pull', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '15' },
  { id: 'shrugs_db', name: 'Encolhimento (Halteres)', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: '15' },
  { id: 'shrugs_bar', name: 'Encolhimento (Barra)', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: '12-15' },

  // PERNAS (Quadriceps)
  { id: 'squat_bar', name: 'Agachamento Livre (Barra)', muscleGroup: 'legs_quads', defaultSets: 4, defaultReps: '6-10' },
  { id: 'squat_front', name: 'Agachamento Frontal', muscleGroup: 'legs_quads', defaultSets: 4, defaultReps: '8-10' },
  { id: 'squat_goblet', name: 'Agachamento Goblet', muscleGroup: 'legs_quads', defaultSets: 3, defaultReps: '12' },
  { id: 'leg_press_45', name: 'Leg Press 45º', muscleGroup: 'legs_quads', defaultSets: 4, defaultReps: '10-12' },
  { id: 'leg_press_horizontal', name: 'Leg Press Horizontal', muscleGroup: 'legs_quads', defaultSets: 3, defaultReps: '12-15' },
  { id: 'leg_extension', name: 'Cadeira Extensora', muscleGroup: 'legs_quads', defaultSets: 4, defaultReps: '12-15' },
  { id: 'lunge_walking', name: 'Passada (Walking Lunge)', muscleGroup: 'legs_quads', defaultSets: 3, defaultReps: '20 passos' },
  { id: 'lunge_static', name: 'Afundo (Estático)', muscleGroup: 'legs_quads', defaultSets: 3, defaultReps: '10-12' },
  { id: 'bulgarian_split_squat', name: 'Agachamento Búlgaro', muscleGroup: 'legs_quads', defaultSets: 3, defaultReps: '10-12' },
  { id: 'hack_squat', name: 'Hack Machine', muscleGroup: 'legs_quads', defaultSets: 3, defaultReps: '10-12' },

  // PERNAS (Posterior)
  { id: 'stiff_bar', name: 'Stiff (Barra)', muscleGroup: 'legs_hams', defaultSets: 4, defaultReps: '8-12' },
  { id: 'stiff_db', name: 'Stiff (Halteres)', muscleGroup: 'legs_hams', defaultSets: 4, defaultReps: '10-12' },
  { id: 'rdl', name: 'Levantamento Terra Romeno', muscleGroup: 'legs_hams', defaultSets: 4, defaultReps: '8-10' },
  { id: 'leg_curl_lying', name: 'Mesa Flexora', muscleGroup: 'legs_hams', defaultSets: 4, defaultReps: '12-15' },
  { id: 'leg_curl_seated', name: 'Cadeira Flexora', muscleGroup: 'legs_hams', defaultSets: 4, defaultReps: '12-15' },
  { id: 'good_morning', name: 'Bom Dia (Good Morning)', muscleGroup: 'legs_hams', defaultSets: 3, defaultReps: '10-12' },
  { id: 'glute_bridge', name: 'Elevação Pélvica', muscleGroup: 'legs_hams', defaultSets: 4, defaultReps: '10-12' },

  // PANTURRILHA
  { id: 'calf_raise_standing', name: 'Panturrilha em Pé (Máquina)', muscleGroup: 'calves', defaultSets: 4, defaultReps: '15-20' },
  { id: 'calf_raise_seated', name: 'Panturrilha Sentado (Banco)', muscleGroup: 'calves', defaultSets: 4, defaultReps: '15-20' },
  { id: 'calf_raise_leg_press', name: 'Panturrilha no Leg Press', muscleGroup: 'calves', defaultSets: 4, defaultReps: '15-20' },
  { id: 'calf_raise_smith', name: 'Panturrilha no Smith', muscleGroup: 'calves', defaultSets: 4, defaultReps: '15-20' },

  // BICEPS
  { id: 'bicep_curl_bar_straight', name: 'Rosca Direta (Barra Reta)', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'bicep_curl_bar_ez', name: 'Rosca Direta (Barra W)', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'bicep_curl_db', name: 'Rosca Alternada (Halteres)', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'hammer_curl', name: 'Rosca Martelo', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'preacher_curl', name: 'Rosca Scott', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'concentration_curl', name: 'Rosca Concentrada', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '12-15' },
  { id: 'cable_curl', name: 'Rosca na Polia Baixa', muscleGroup: 'biceps', defaultSets: 3, defaultReps: '12-15' },

  // TRICEPS
  { id: 'tricep_pushdown_rope', name: 'Tríceps Polia (Corda)', muscleGroup: 'triceps', defaultSets: 3, defaultReps: '12-15' },
  { id: 'tricep_pushdown_bar', name: 'Tríceps Polia (Barra)', muscleGroup: 'triceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'skullcrusher_bar', name: 'Tríceps Testa (Barra W)', muscleGroup: 'triceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'french_press', name: 'Tríceps Francês', muscleGroup: 'triceps', defaultSets: 3, defaultReps: '10-12' },
  { id: 'tricep_kickback', name: 'Tríceps Coice', muscleGroup: 'triceps', defaultSets: 3, defaultReps: '12-15' },
  { id: 'bench_dip', name: 'Mergulho no Banco', muscleGroup: 'triceps', defaultSets: 3, defaultReps: 'Falha' },

  // ABS
  { id: 'plank', name: 'Prancha', muscleGroup: 'abs', defaultSets: 3, defaultReps: '1 min' },
  { id: 'crunches', name: 'Abdominal Supra', muscleGroup: 'abs', defaultSets: 3, defaultReps: '20' },
  { id: 'leg_raise', name: 'Elevação de Pernas', muscleGroup: 'abs', defaultSets: 3, defaultReps: '15' },
  { id: 'russian_twist', name: 'Russian Twist', muscleGroup: 'abs', defaultSets: 3, defaultReps: '20' },
  { id: 'ab_wheel', name: 'Roda Abdominal', muscleGroup: 'abs', defaultSets: 3, defaultReps: '10-15' },
];

export const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Peito',
  back: 'Costas',
  shoulders: 'Ombros',
  legs_quads: 'Quadríceps',
  legs_hams: 'Posterior',
  calves: 'Panturrilha',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abs: 'Abdômen',
  cardio: 'Cardio',
};
