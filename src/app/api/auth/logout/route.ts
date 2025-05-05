import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Remove o cookie de autenticação de três maneiras diferentes para garantir
    response.cookies.delete('auth_token');
    response.cookies.set({
      name: 'auth_token',
      value: '',
      maxAge: -1,
      path: '/',
    });
    response.headers.set('Set-Cookie', 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    // Adiciona cabeçalho para forçar atualização do estado
    response.headers.set('X-Auth-Event', 'logout');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}