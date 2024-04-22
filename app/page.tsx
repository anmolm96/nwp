import { WorkoutList } from "@/components/workout-generator";
import { getAllWorkouts } from "../lib/actions";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Page() {
  const workouts = await getAllWorkouts();
  return <WorkoutList workouts={workouts} />;
}
