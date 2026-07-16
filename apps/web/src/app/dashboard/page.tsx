'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/auth/session';
import { User } from '@/types/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage (set during login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage');
      }
    }
  }, []);

  const handleLogout = async () => {
    // Clear cookies
    await clearSession();
    
    // Clear local storage
    localStorage.removeItem('user');
    
    // Note: We should ideally also call the API /auth/logout to invalidate the refresh token
    // but for now this clears the client state
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1">
            Bienvenido al panel de administración de J&B Bijouteria.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-pink-700 bg-white border border-pink-200 rounded-md shadow-sm hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-medium text-stone-900 mb-4">Información del Usuario</h2>
        
        {user ? (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-stone-500">Nombre</dt>
              <dd className="mt-1 text-sm text-stone-900">{user.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-stone-500">Correo Electrónico</dt>
              <dd className="mt-1 text-sm text-stone-900">{user.email}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-stone-500">Roles</dt>
              <dd className="mt-1 text-sm text-stone-900">
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.roles.map((role) => (
                    <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 capitalize">
                      {role}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-stone-500">Permisos ({user.permissions.length})</dt>
              <dd className="mt-1 text-sm text-stone-900">
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.permissions.slice(0, 10).map((permission) => (
                    <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-800">
                      {permission}
                    </span>
                  ))}
                  {user.permissions.length > 10 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-600">
                      +{user.permissions.length - 10} más
                    </span>
                  )}
                </div>
              </dd>
            </div>
          </dl>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded"></div>
                <div className="h-4 bg-stone-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
