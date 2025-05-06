/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { FuriaLogo } from '@/components/FuriaLogo';
import { useRouter } from 'next/navigation';


interface User {
  _id: string;
  name: string;
  email: string;
  verified: boolean;
  verificationStep: number;
  cpf?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Iniciando busca dos dados do usuário...'); // Debug
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Resposta da API:', response); // Debug

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro na resposta:', errorData); // Debug
          throw new Error(errorData.error || 'Erro ao carregar perfil');
        }

        const userData = await response.json();
        console.log('Dados do usuário recebidos:', userData); // Debug

        if (!userData) {
          throw new Error('Dados do usuário não encontrados');
        }

        setUser(userData);
      } catch (err: any) {
        console.error('Erro ao buscar dados do usuário:', err); // Debug
        setError(err.message || 'Erro ao carregar dados do usuário');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse flex flex-col items-center gap-2">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Carregando perfil...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-pink-400 text-center p-4 border border-pink-400/30 rounded-lg max-w-md">
          <p className="text-lg font-bold mb-2">Ops!</p>
          <p>{error || 'Usuário não encontrado'}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-pink-500/10 border border-pink-400/30 rounded-lg hover:bg-pink-500/20 transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-100 relative overflow-hidden pt-4 sm:pt-6 lg:pt-8">
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <FuriaLogo className="h-10 text-pink-500" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
            MEU PERFIL
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Seção de Informações */}
          <div className="md:col-span-2 bg-stone-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">INFORMAÇÕES</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-400">Nome</p>
                <p className="text-stone-100">{user.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-stone-400">Email</p>
                <p className="text-stone-100">{user.email}</p>
              </div>

              {user.cpf && (
                <div>
                  <p className="text-sm text-stone-400">CPF</p>
                  <p className="text-stone-100">
                    {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-stone-400">Status</p>
                <p className={`font-bold ${
                  user.verified ? 'text-lime-400' : 'text-amber-400'
                }`}>
                  {user.verified ? 'Verificado' : 'Não verificado'}
                </p>
              </div>

              {user.createdAt && (
                <div>
                  <p className="text-sm text-stone-400">Membro desde</p>
                  <p className="text-stone-100">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seção de Verificação */}
          <div className="bg-stone-900/80 backdrop-blur-sm border border-pink-400/30 rounded-xl p-6 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
            <h2 className="text-xl font-bold text-pink-300 mb-4">VERIFICAÇÃO</h2>
            
            {!user.verified ? (
              <div className="space-y-4">
                <p className="text-sm text-stone-300">
                  Complete a verificação para desbloquear benefícios:
                </p>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span> Cadastro Básico
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={user.verificationStep > 0 ? 'text-cyan-400' : 'text-stone-500'}>✓</span> Documento de Identidade
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={user.verificationStep > 1 ? 'text-cyan-400' : 'text-stone-500'}>✓</span> Redes Sociais
                  </li>
                </ul>
                
                <button
                  onClick={() => router.push('/verify')}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
                >
                  Verificar Perfil
                </button>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="text-lime-400 text-2xl mb-2">✓</div>
                <p className="font-bold text-lime-400">Perfil Verificado</p>
                <p className="text-sm text-stone-300 mt-2">
                  Você tem acesso completo a todos os benefícios!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}