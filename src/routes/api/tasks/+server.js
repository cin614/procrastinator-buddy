import { db } from '$lib/server/mongo';
import { json } from '@sveltejs/kit';

export async function GET() {
  const tasks = await db.collection('tasks').find().toArray();

  return json(tasks);
}

export async function POST({ request }) {
  const task = await request.json();

  await db.collection('tasks').insertOne(task);

  return json({
    success: true
  });
}