export type Exercise = {
  name: string;
  description: string;
  reps: string;
  sets: string;
  bodyPart: string;
};

export type Workout = {
  name: string;
  duration: number;
  excercises: Exercise[];
};
