// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { jwtVerify } from 'jose';
import { ObjectId } from 'mongodb';

interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  verified?: boolean;
  verifiedAt?: Date;
  // Add other user fields as needed
}

export async function GET(request: Request) {
  try {
    // 1. Extract token from cookies
    const authToken = request.headers.get('cookie')?.split('; ')
      .find(cookie => cookie.startsWith('auth_token='))
      ?.split('=')[1];
    
    if (!authToken) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Auth-Status': 'unauthenticated'
        }
      });
    }

    // 2. Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(authToken, secret, {
      algorithms: ['HS256']
    });

    // 3. Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    // 4. Find user
    const user = await db.collection<User>('users').findOne({
      _id: new ObjectId(payload.userId as string),
      email: payload.email as string
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: {
          'Set-Cookie': 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
          'X-Auth-Event': 'logout',
          'Cache-Control': 'no-store'
        }
      });
    }

    // 5. Return user data (excluding sensitive fields)
    const { password, ...safeUserData } = user;
    
    return new Response(JSON.stringify({
      ...safeUserData,
      _id: safeUserData._id.toString(), // Convert ObjectId to string
      verified: safeUserData.verified || false // Ensure boolean
    }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Auth-Status': 'authenticated'
      }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro de autenticação',
      ...(process.env.NODE_ENV === 'development' && error instanceof Error && { details: error.message })
    }), {
      status: 401,
      headers: {
        'Set-Cookie': 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'X-Auth-Event': 'logout',
        'Cache-Control': 'no-store'
      }
    });
  }
}

export async function POST() {
  return new Response(JSON.stringify({ error: 'Método não permitido' }), {
    status: 405,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}