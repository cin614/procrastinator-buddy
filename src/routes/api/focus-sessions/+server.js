import { db } from '$lib/server/mongo';
import { json } from '@sveltejs/kit';

export async function GET() {
    const sessions = await db.collection('focusSessions').find().toArray();

    return json(sessions);
}

export async function POST({ request }) {
    const session = await request.json();

    await db.collection('focusSessions').insertOne({
        ...session,
        createdAt: new Date()
    });

    return json({
        success: true
    });
}