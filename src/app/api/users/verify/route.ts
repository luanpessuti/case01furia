// app/api/users/verify/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  const { userId } = await request.json();
  
  const client = await connectToDatabase();
  const db = client.db();
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { verified: true, verifiedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}