'use client';

import Link from 'next/link';
import { FuriaLogo } from './FuriaLogo';

export function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-stone-900 to-stone-800 border-b border-amber-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo à esquerda */}
          <div className="flex-shrink-0 flex items-center">
            <FuriaLogo className="h-8 text-amber-400" />
            <span className="ml-2 text-xl font-title text-white">FURIA</span>
          </div>

          {/* Links centrais */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-amber-400 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors">
              Ao Vivo
            </Link>
            <Link href="#" className="text-stone-300 hover:text-amber-400  px-3 py-2 text-sm font-medium transition-colors">
              Próximos Jogos
            </Link>
            <Link href="#" className="text-stone-300 hover:text-amber-400  px-3 py-2 text-sm font-medium transition-colors">
              Elenco
            </Link>
            <Link href="#" className="text-stone-300 hover:text-amber-400  px-3 py-2 text-sm font-medium transition-colors">
              Notícias
            </Link>
          </div>

          {/* Botão à direita */}
          <div className="hidden md:block">
            <Link 
              href="#" 
              className="bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-2 rounded-md text-sm font-bold transition-colors"
            >
              Torne-se Membro
            </Link>
          </div>

          {/* Mobile menu button (opcional) */}
          <div className="md:hidden">
            <button className="text-stone-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}