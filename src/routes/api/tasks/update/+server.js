import { db } from '$lib/server/mongo';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export async function POST({ request }) {
  const task = await request.json();

  await db.collection('tasks').updateOne(
    { _id: new ObjectId(task._id) },
    {
      $set: {
        title: task.title,
        priority: task.priority,
        deadline: task.deadline,
        completed: task.completed
      }
    }
  );

  return json({
    success: true
  });
}