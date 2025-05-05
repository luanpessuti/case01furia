'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FuriaLogo } from './FuriaLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-stone-950/95 backdrop-blur-lg border-b border-cyan-400/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
        : 'bg-stone-950/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <FuriaLogo className="h-8 text-pink-400 hover:text-cyan-400 transition-colors" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
                FURIA
              </span>
            </Link>
          </motion.div>

          {/* Links centrais */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" text="AO VIVO" isActive />
            <NavLink href="#" text="PRÓXIMOS JOGOS" />
            <NavLink href="#" text="ELENCO" />
          </div>

          {/* Botões à direita */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="https://furia.gg" 
                target="_blank"
                className="px-3 py-1.5 rounded-md text-sm font-bold border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all flex items-center gap-1"
              >
                <span>LOJA OFICIAL</span>
              </Link>
            </motion.div>
            
            {loading ? (
              <div className="h-8 w-20 bg-stone-800 rounded-md animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-md text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.name.split(' ')[0]}
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-stone-900/95 backdrop-blur-lg rounded-md shadow-lg border border-cyan-400/20 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-800/50 hover:text-cyan-300 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Meu Perfil
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-stone-300 hover:bg-stone-800/50 hover:text-pink-300 transition-colors"
                        >
                          Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-md text-sm font-bold bg-gradient-to-r from-cyan-400 to-lime-400 text-stone-900 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all"
                >
                  LOGIN
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-md text-cyan-300 hover:text-pink-400 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 bg-stone-900/95 backdrop-blur-lg border-t border-cyan-400/20">
              {[
                { href: "#/", text: "AO VIVO" },
                { href: "#", text: "PRÓXIMOS JOGOS" },
                { href: "#", text: "ELENCO" },
              ].map((item) => (
                <Link
                  key={item.text}
                  href={item.href}
                  className="block px-3 py-3 text-base font-medium text-stone-300 hover:text-pink-400 hover:bg-stone-800/50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.text}
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-stone-800">
                <Link
                  href="https://loja.furia.gg"
                  target="_blank"
                  className="px-3 py-3 mb-2 text-base font-medium text-cyan-300 hover:bg-cyan-400/10 rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>LOJA OFICIAL</span>
                  <span>🛒</span>
                </Link>
                
                <Link
                  href="/login"
                  className="block px-3 py-3 text-center text-base font-bold bg-gradient-to-r from-cyan-400 to-lime-400 text-stone-900 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  LOGIN
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Componente auxiliar para os links de navegação
function NavLink({ href, text, isActive = false }: { href: string; text: string; isActive?: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Link
        href={href}
        className={`px-3 py-2 text-sm font-medium transition-all relative ${
          isActive 
            ? 'text-cyan-300 font-bold' 
            : 'text-stone-300 hover:text-pink-300'
        }`}
      >
        {text}
        {isActive && (
          <motion.span 
            layoutId="navActiveIndicator"
            className="absolute left-0 bottom-0 w-full h-0.5 bg-cyan-400 rounded-full"
            initial={false}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}
      </Link>
    </motion.div>
  );
}