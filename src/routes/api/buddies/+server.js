import { db } from "$lib/server/mongo";
import { json } from "@sveltejs/kit";

export async function GET() {
  const buddies = await db.collection("buddies").find().toArray();

  return json(buddies);
}

export async function POST({ request }) {
  const buddy = await request.json();

  await db.collection("buddies").insertOne({
    ...buddy,
    createdAt: new Date()
  });

  return json({
    success: true
  });
}