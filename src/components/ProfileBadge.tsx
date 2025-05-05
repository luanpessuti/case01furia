// components/ProfileBadge.tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';

export function ProfileBadge() {
  const { user } = useAuth();
  
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-bold">{user?.name}</h2>
      {user?.verified && (
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Verificado
        </span>
      )}
    </div>
  );
}