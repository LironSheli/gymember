export interface ExerciseCategory {
  id: number;
  name_key: string;
}

export interface Exercise {
  id: number;
  category_id: number;
  name_key: string;
  title_key: string;
  desc_key: string;
  instructions_key: string;
}

// Exercise Categories
export const exerciseCategories: ExerciseCategory[] = [
  { id: 1, name_key: "chest" },
  { id: 2, name_key: "back" },
  { id: 3, name_key: "shoulders" },
  { id: 4, name_key: "arms" },
  { id: 5, name_key: "legs" },
  { id: 6, name_key: "core" },
  { id: 7, name_key: "cardio" },
];

// Exercises
export const exercises: Exercise[] = [
  // Chest
  {
    id: 1,
    category_id: 1,
    name_key: "bench_press",
    title_key: "exercise.bench_press.title",
    desc_key: "exercise.bench_press.desc",
    instructions_key: "exercise.bench_press.instructions",
  },
  {
    id: 2,
    category_id: 1,
    name_key: "incline_bench_press",
    title_key: "exercise.incline_bench_press.title",
    desc_key: "exercise.incline_bench_press.desc",
    instructions_key: "exercise.incline_bench_press.instructions",
  },
  {
    id: 3,
    category_id: 1,
    name_key: "decline_bench_press",
    title_key: "exercise.decline_bench_press.title",
    desc_key: "exercise.decline_bench_press.desc",
    instructions_key: "exercise.decline_bench_press.instructions",
  },
  {
    id: 4,
    category_id: 1,
    name_key: "dumbbell_flyes",
    title_key: "exercise.dumbbell_flyes.title",
    desc_key: "exercise.dumbbell_flyes.desc",
    instructions_key: "exercise.dumbbell_flyes.instructions",
  },
  {
    id: 5,
    category_id: 1,
    name_key: "push_ups",
    title_key: "exercise.push_ups.title",
    desc_key: "exercise.push_ups.desc",
    instructions_key: "exercise.push_ups.instructions",
  },

  // Back
  {
    id: 6,
    category_id: 2,
    name_key: "pull_ups",
    title_key: "exercise.pull_ups.title",
    desc_key: "exercise.pull_ups.desc",
    instructions_key: "exercise.pull_ups.instructions",
  },
  {
    id: 7,
    category_id: 2,
    name_key: "lat_pulldown",
    title_key: "exercise.lat_pulldown.title",
    desc_key: "exercise.lat_pulldown.desc",
    instructions_key: "exercise.lat_pulldown.instructions",
  },
  {
    id: 8,
    category_id: 2,
    name_key: "barbell_rows",
    title_key: "exercise.barbell_rows.title",
    desc_key: "exercise.barbell_rows.desc",
    instructions_key: "exercise.barbell_rows.instructions",
  },
  {
    id: 9,
    category_id: 2,
    name_key: "dumbbell_rows",
    title_key: "exercise.dumbbell_rows.title",
    desc_key: "exercise.dumbbell_rows.desc",
    instructions_key: "exercise.dumbbell_rows.instructions",
  },
  {
    id: 10,
    category_id: 2,
    name_key: "deadlift",
    title_key: "exercise.deadlift.title",
    desc_key: "exercise.deadlift.desc",
    instructions_key: "exercise.deadlift.instructions",
  },

  // Shoulders
  {
    id: 11,
    category_id: 3,
    name_key: "shoulder_press",
    title_key: "exercise.shoulder_press.title",
    desc_key: "exercise.shoulder_press.desc",
    instructions_key: "exercise.shoulder_press.instructions",
  },
  {
    id: 12,
    category_id: 3,
    name_key: "lateral_raises",
    title_key: "exercise.lateral_raises.title",
    desc_key: "exercise.lateral_raises.desc",
    instructions_key: "exercise.lateral_raises.instructions",
  },
  {
    id: 13,
    category_id: 3,
    name_key: "front_raises",
    title_key: "exercise.front_raises.title",
    desc_key: "exercise.front_raises.desc",
    instructions_key: "exercise.front_raises.instructions",
  },
  {
    id: 14,
    category_id: 3,
    name_key: "rear_delt_flyes",
    title_key: "exercise.rear_delt_flyes.title",
    desc_key: "exercise.rear_delt_flyes.desc",
    instructions_key: "exercise.rear_delt_flyes.instructions",
  },
  {
    id: 15,
    category_id: 3,
    name_key: "upright_rows",
    title_key: "exercise.upright_rows.title",
    desc_key: "exercise.upright_rows.desc",
    instructions_key: "exercise.upright_rows.instructions",
  },

  // Arms
  {
    id: 16,
    category_id: 4,
    name_key: "bicep_curls",
    title_key: "exercise.bicep_curls.title",
    desc_key: "exercise.bicep_curls.desc",
    instructions_key: "exercise.bicep_curls.instructions",
  },
  {
    id: 17,
    category_id: 4,
    name_key: "tricep_dips",
    title_key: "exercise.tricep_dips.title",
    desc_key: "exercise.tricep_dips.desc",
    instructions_key: "exercise.tricep_dips.instructions",
  },
  {
    id: 18,
    category_id: 4,
    name_key: "hammer_curls",
    title_key: "exercise.hammer_curls.title",
    desc_key: "exercise.hammer_curls.desc",
    instructions_key: "exercise.hammer_curls.instructions",
  },
  {
    id: 19,
    category_id: 4,
    name_key: "tricep_pushdowns",
    title_key: "exercise.tricep_pushdowns.title",
    desc_key: "exercise.tricep_pushdowns.desc",
    instructions_key: "exercise.tricep_pushdowns.instructions",
  },
  {
    id: 20,
    category_id: 4,
    name_key: "preacher_curls",
    title_key: "exercise.preacher_curls.title",
    desc_key: "exercise.preacher_curls.desc",
    instructions_key: "exercise.preacher_curls.instructions",
  },

  // Legs
  {
    id: 21,
    category_id: 5,
    name_key: "squats",
    title_key: "exercise.squats.title",
    desc_key: "exercise.squats.desc",
    instructions_key: "exercise.squats.instructions",
  },
  {
    id: 22,
    category_id: 5,
    name_key: "lunges",
    title_key: "exercise.lunges.title",
    desc_key: "exercise.lunges.desc",
    instructions_key: "exercise.lunges.instructions",
  },
  {
    id: 23,
    category_id: 5,
    name_key: "leg_press",
    title_key: "exercise.leg_press.title",
    desc_key: "exercise.leg_press.desc",
    instructions_key: "exercise.leg_press.instructions",
  },
  {
    id: 24,
    category_id: 5,
    name_key: "calf_raises",
    title_key: "exercise.calf_raises.title",
    desc_key: "exercise.calf_raises.desc",
    instructions_key: "exercise.calf_raises.instructions",
  },
  {
    id: 25,
    category_id: 5,
    name_key: "leg_extensions",
    title_key: "exercise.leg_extensions.title",
    desc_key: "exercise.leg_extensions.desc",
    instructions_key: "exercise.leg_extensions.instructions",
  },

  // Core
  {
    id: 26,
    category_id: 6,
    name_key: "crunches",
    title_key: "exercise.crunches.title",
    desc_key: "exercise.crunches.desc",
    instructions_key: "exercise.crunches.instructions",
  },
  {
    id: 27,
    category_id: 6,
    name_key: "plank",
    title_key: "exercise.plank.title",
    desc_key: "exercise.plank.desc",
    instructions_key: "exercise.plank.instructions",
  },
  {
    id: 28,
    category_id: 6,
    name_key: "russian_twist",
    title_key: "exercise.russian_twist.title",
    desc_key: "exercise.russian_twist.desc",
    instructions_key: "exercise.russian_twist.instructions",
  },
  {
    id: 29,
    category_id: 6,
    name_key: "leg_raises",
    title_key: "exercise.leg_raises.title",
    desc_key: "exercise.leg_raises.desc",
    instructions_key: "exercise.leg_raises.instructions",
  },
  {
    id: 30,
    category_id: 6,
    name_key: "mountain_climbers",
    title_key: "exercise.mountain_climbers.title",
    desc_key: "exercise.mountain_climbers.desc",
    instructions_key: "exercise.mountain_climbers.instructions",
  },

  // Cardio
  {
    id: 31,
    category_id: 7,
    name_key: "running",
    title_key: "exercise.running.title",
    desc_key: "exercise.running.desc",
    instructions_key: "exercise.running.instructions",
  },
  {
    id: 32,
    category_id: 7,
    name_key: "cycling",
    title_key: "exercise.cycling.title",
    desc_key: "exercise.cycling.desc",
    instructions_key: "exercise.cycling.instructions",
  },
  {
    id: 33,
    category_id: 7,
    name_key: "jump_rope",
    title_key: "exercise.jump_rope.title",
    desc_key: "exercise.jump_rope.desc",
    instructions_key: "exercise.jump_rope.instructions",
  },
  {
    id: 34,
    category_id: 7,
    name_key: "burpee",
    title_key: "exercise.burpee.title",
    desc_key: "exercise.burpee.desc",
    instructions_key: "exercise.burpee.instructions",
  },
  {
    id: 35,
    category_id: 7,
    name_key: "rowing",
    title_key: "exercise.rowing.title",
    desc_key: "exercise.rowing.desc",
    instructions_key: "exercise.rowing.instructions",
  },
];

// Helper functions
export const getCategories = (): ExerciseCategory[] => {
  return exerciseCategories;
};

export const getExercisesByCategory = (categoryId: number): Exercise[] => {
  return exercises.filter((exercise) => exercise.category_id === categoryId);
};

export const getExerciseById = (id: number): Exercise | undefined => {
  return exercises.find((exercise) => exercise.id === id);
};

export const getCategoryById = (id: number): ExerciseCategory | undefined => {
  return exerciseCategories.find((category) => category.id === id);
};
