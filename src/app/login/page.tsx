'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FuriaLogo } from '@/components/FuriaLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo FURIA */}
        <div className="flex justify-center mb-8">
          <FuriaLogo className="h-12 text-pink-500" />
        </div>

        {/* Card de Login */}
        <form onSubmit={handleSubmit} className="bg-stone-900/90 backdrop-blur-lg border border-cyan-400/30 rounded-xl p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden">
          {/* Efeitos de borda */}
          <div className="absolute inset-0 rounded-xl pointer-events-none" />
          
          <h2 className="text-2xl font-title text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
            ACESSO RESTRITO
          </h2>

          <div className="space-y-4">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">E-MAIL</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-stone-800/80 border border-cyan-400/30 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]" />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-pink-300 mb-1">SENHA</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-stone-800/80 border border-pink-400/30 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none border border-pink-400/20 shadow-[inset_0_0_10px_rgba(236,72,153,0.05)]" />
              </div>
            </div>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-title text-stone-900 bg-gradient-to-r from-cyan-400 to-lime-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-stone-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AUTENTICANDO...
                </>
              ) : (
                'ACESSAR SISTEMA'
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/80 to-lime-400/80 blur-[6px] -z-0" />
          </button>

          {/* Links extras */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 text-sm">
            <a href="/forgot-password" className="text-cyan-300 hover:text-cyan-200 hover:underline transition-colors">
              Esqueceu a senha?
            </a>
            <span className="hidden sm:inline text-stone-500">|</span>
            <a href="/register" className="text-pink-300 hover:text-pink-200 hover:underline transition-colors">
              Criar nova conta
            </a>
          </div>
        </form>

        {/* Mensagem de segurança */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-500 font-body">
            <span className="text-cyan-400/80">//</span> ACESSO RESTRITO À COMUNIDADE FURIA
          </p>
        </div>
      </div>
    </div>
  );
}