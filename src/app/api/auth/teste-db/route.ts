import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const client = await db;
    await client.db().admin().ping();
    return NextResponse.json({ status: '✅ Conexão com MongoDB estabelecida!' });
  } catch (error) {
    return NextResponse.json(
      { error: '❌ Falha na conexão: ' + (error as Error).message },
      { status: 500 }
    );
  }
}