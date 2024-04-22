"use server";

import { revalidatePath } from "next/cache";
import { generateSlug } from "random-word-slugs";
import { kv } from "@vercel/kv";

import { redirect } from "next/navigation";
import OpenAI from "openai";
import { Exercise, Workout } from "./types";
import { cache } from "react";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateWorkout({
  duration,
  bodyParts,
}: {
  duration: number;
  bodyParts: string[];
}) {
  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a helpful fitness assistant that outputs workout plans in JSON. You will be given a duration and body parts. Generate a workout plan that includes the duration and body parts. Response should be just JSON and nothing else in the following format as an array of objects: { name: "Exercise name", description: "description of how to perform the excercise", reps: "number (singular)", sets: "number (singular)", bodyPart: "body part targeted" }`,
      },
      {
        role: "user",
        content: `Body Parts: ${bodyParts.join(
          ", "
        )}\nDuration: ${duration} minutes`,
      },
    ],
  });

  const randomSlug = generateSlug();

  const excercisesRaw = response.choices[0].message.content;
  const excercises = JSON.parse(excercisesRaw ?? "[]") as Exercise[];
  const newWorkout: Workout = { excercises, name: randomSlug, duration };
  await kv.set(`workout:${randomSlug}`, JSON.stringify(newWorkout));

  revalidatePath("/", "page");
  redirect(`/workout/${randomSlug}`);
}

export const getAllWorkouts = cache(async () => {
  const allKeys = await kv.keys("workout:*");
  const allWorkouts = (await Promise.all(
    allKeys.map(async (k) => await kv.get(k))
  )) as Workout[];
  return allWorkouts;
});
