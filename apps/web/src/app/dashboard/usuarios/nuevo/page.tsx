'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUser, getRoles } from '@/lib/users/api';

import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth/session';

const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roleIds: z.array(z.string()).min(1, 'Debes seleccionar al menos un rol'),
});

type UserForm = z.infer<typeof userSchema>;

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      roleIds: [],
    }
  });

  const selectedRoles = watch('roleIds');

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch((err) => console.error('Error cargando roles', err));
  }, []);

  const handleRoleToggle = (roleId: string) => {
    const current = new Set(selectedRoles);
    if (current.has(roleId)) {
      current.delete(roleId);
    } else {
      current.add(roleId);
    }
    setValue('roleIds', Array.from(current), { shouldValidate: true });
  };

  const onSubmit = async (data: UserForm) => {
    try {
      setIsSubmitting(true);
      setError('');
      await createUser(data);
      router.push('/dashboard/usuarios');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/usuarios"
          className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Nuevo Usuario</h1>
          <p className="text-sm text-stone-500">Completa los datos para registrar un usuario</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Nombre Completo</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-stone-900 placeholder-stone-400 outline-none"
              placeholder="Ej. Juan Pérez"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Correo Electrónico</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-stone-900 placeholder-stone-400 outline-none"
              placeholder="juan@ejemplo.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Contraseña</label>
            <input
              type="text"
              {...register('password')}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-stone-900 placeholder-stone-400 outline-none"
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Roles del Usuario</label>
            {errors.roleIds && <p className="text-xs text-red-500 mb-2">{errors.roleIds.message}</p>}
            
            <div className="grid grid-cols-2 gap-3">
              {roles.map(role => {
                const isSelected = selectedRoles.includes(role.id);
                return (
                  <div 
                    key={role.id}
                    onClick={() => handleRoleToggle(role.id)}
                    className={`cursor-pointer border p-4 rounded-xl flex items-center justify-between transition-all ${isSelected ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                  >
                    <div>
                      <p className={`font-bold ${isSelected ? 'text-pink-700' : 'text-stone-700'}`}>{role.name}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-stone-300'}`}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
              {roles.length === 0 && (
                <div className="col-span-2 p-4 text-center text-sm text-stone-500 bg-stone-50 rounded-xl border border-stone-100">
                  Cargando roles disponibles...
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(236,72,153,0.39)] bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold transition-all disabled:opacity-50 hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] hover:scale-[1.01] active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando Usuario...
                </span>
              ) : (
                'Registrar Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
