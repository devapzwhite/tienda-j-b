'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/users/api';

export function UserForm({ roles }: { roles: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      roleIds: [formData.get('roleId')],
    };

    try {
      await createUser(data);
      router.push('/dashboard/usuarios');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 md:p-8">
      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Ej. María Pérez"
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors bg-white text-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            required
            placeholder="maria@tienda.com"
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors bg-white text-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors bg-white text-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Rol</label>
          <select
            name="roleId"
            required
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors bg-white text-stone-900 appearance-none"
          >
            <option value="">Selecciona un rol...</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-pink-500/20 disabled:opacity-70"
          >
            {loading ? 'Registrando...' : 'Registrar Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}
