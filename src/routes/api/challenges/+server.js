import { db } from "$lib/server/mongo";
import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function GET() {
  const challenges = await db.collection("challenges").find().toArray();

  return json(challenges);
}

export async function POST({ request }) {
  const challenge = await request.json();

  await db.collection("challenges").insertOne({
    ...challenge,
    status: "pending",
    createdAt: new Date()
  });

  return json({
    success: true
  });
}

export async function PUT({ request }) {
  const challenge = await request.json();

  if (challenge.taskId) {
    await db.collection("challenges").updateOne(
      {
        taskId: challenge.taskId,
        status: { $ne: "completed" }
      },
      {
        $set: {
          status: challenge.status
        }
      }
    );
  } else {
    await db.collection("challenges").updateOne(
      { _id: new ObjectId(challenge._id) },
      {
        $set: {
          status: challenge.status
        }
      }
    );
  }

  return json({
    success: true
  });
}
export async function DELETE({ request }) {
  const { id } = await request.json();

  await db.collection("challenges").deleteOne({
    _id: new ObjectId(id)
  });

  return json({
    success: true
  });
}