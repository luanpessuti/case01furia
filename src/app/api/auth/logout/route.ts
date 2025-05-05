import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Remove o cookie de autenticação
    response.cookies.set({
      name: 'auth_token',
      value: '',
      maxAge: -1, // Expira imediatamente
      path: '/',
    });

    // Dispara evento para atualizar todos os componentes
    response.headers.set('X-Auth-Event', 'logout');

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout.' },
      { status: 500 }
    );
  }
}
