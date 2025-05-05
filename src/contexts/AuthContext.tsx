'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  _id?: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldCheckAuth, setShouldCheckAuth] = useState(true); // Novo estado
  const router = useRouter();

  const fetchUser = async () => {
    if (!shouldCheckAuth) return; // Não faz requisição se não necessário
    
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });
      
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
        setShouldCheckAuth(false); // Para de checar após 401
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
      setShouldCheckAuth(false); // Para de checar em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Interceptor para detectar logout
    const originalFetch = window.fetch;
    
    const interceptedFetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);
      
      if (response.headers.get('X-Auth-Event') === 'logout') {
        setUser(null);
        window.dispatchEvent(new Event('storage')); // Dispara evento para outros tabs
      }
      
      return response;
    };

    window.fetch = interceptedFetch;

    // Listener para eventos de storage (outras abas)
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    fetchUser(); // Carrega o estado inicial

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setUser(await res.json());
        setShouldCheckAuth(true); // Reativa
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null);
        window.dispatchEvent(new Event('storage'));
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);