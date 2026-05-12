import { db } from '$lib/server/mongo';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export async function POST({ request }) {
  const { id } = await request.json();

  await db.collection('tasks').deleteOne({
    _id: new ObjectId(id)
  });

  return json({
    success: true
  });
}