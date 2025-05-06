/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FuriaLogo } from '@/components/FuriaLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (formData.cpf && !/^\d{11}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no cadastro');
      }

      // Redireciona após cadastro bem-sucedido
      router.push('/profile');
    } catch (error: any) {
      console.error('Registration error:', error);
      setApiError(error.message || 'Erro ao cadastrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cpf' ? value.replace(/\D/g, '') : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden sm:mt-16">
      
      <div className="relative z-10 w-full max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <FuriaLogo className="h-12 text-pink-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
            CRIAR CONTA
          </h1>
          <p className="mt-2 text-sm text-cyan-300">
            Nível 1 - Acesso Básico
          </p>
        </div>

        {/* Mensagem de erro da API */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-400/50 rounded-lg text-red-200 text-sm">
            {apiError}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-stone-900/90 backdrop-blur-lg border border-cyan-400/30 rounded-xl p-6 space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">NOME COMPLETO</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-stone-800/80 border ${
                errors.name ? 'border-red-400/50' : 'border-cyan-400/30'
              } rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all`}
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-300 mb-1">E-MAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-stone-800/80 border ${
                errors.email ? 'border-red-400/50' : 'border-pink-400/30'
              } rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all`}
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">SENHA</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-stone-800/80 border ${
                errors.password ? 'border-red-400/50' : 'border-cyan-400/30'
              } rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all`}
              required
              minLength={6}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-300 mb-1">CPF (OPCIONAL)</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
              onChange={handleChange}
              maxLength={14}
              className={`w-full px-4 py-3 bg-stone-800/80 border ${
                errors.cpf ? 'border-red-400/50' : 'border-pink-400/30'
              } rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all`}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <p className="mt-1 text-xs text-red-400">{errors.cpf}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-bold text-stone-900 bg-gradient-to-r from-cyan-400 to-lime-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all relative overflow-hidden disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CRIANDO CONTA...
                </span>
              ) : (
                'CRIAR CONTA'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-stone-400">
          Já tem uma conta?{' '}
          <a href="/login" className="text-cyan-300 hover:underline hover:text-cyan-200">
            Faça login
          </a>
        </div>

        {/* Informações sobre verificação */}
        <div className="mt-6 p-4 border border-purple-400/30 rounded-lg bg-stone-900/50 backdrop-blur-sm sm:mb-10">
          <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <span>🔒</span> VERIFICAÇÃO DE PERFIL (NÍVEL 2)
          </h3>
          <p className="mt-1 text-xs text-stone-300">
            Complete depois para desbloquear recompensas: selo verificado, destaque no chat e acesso a conteúdos exclusivos.
          </p>
        </div>
      </div>
    </div>
  );
}