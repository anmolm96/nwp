import { Workout } from "@/lib/types";
import { WorkoutDetail } from "@/components/workout-detail";
import { kv } from "@vercel/kv";

export default async function Page({ params }: { params: { slug: string } }) {
  const workout = (await kv.get(`workout:${params.slug}`)) as Workout;

  return <WorkoutDetail workout={workout} />;
}
