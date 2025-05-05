import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db'; // Importe a conexão correta
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    // Verificar método HTTP
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Método não permitido' }, 
        { status: 405 }
      );
    }

    // Validar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está configurado');
    }

    const { name, email, password } = await request.json();

    // Validação dos campos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Conexão com o banco de dados
    const client = await connectToDatabase();
    const db = client.db(); // Use o nome do seu banco de dados se necessário
    const users = db.collection('users');

    // Verifica se email já existe
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false // Adicione conforme sua lógica de verificação
    };

    const result = await users.insertOne(newUser);

    // Gera token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: result.insertedId.toString(),
      email: newUser.email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Configura resposta
    const response = NextResponse.json(
      { 
        success: true,
        user: {
          _id: result.insertedId,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    );

    // Configura cookie seguro
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Erro no cadastro',
        ...(process.env.NODE_ENV === 'development' && { details: (error instanceof Error ? error.message : 'Unknown error') })
      },
      { status: 500 }
    );
  }
}