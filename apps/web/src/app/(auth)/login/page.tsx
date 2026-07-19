'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginRequest, AuthError } from '@/lib/auth/api';
import { createSession } from '@/lib/auth/session';

const loginSchema = z.object({
  email: z.string().email('Por favor, ingresa un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

import { Suspense } from 'react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await loginRequest(data.email, data.password);
      
      // Store session cookies using Server Action
      await createSession(response.accessToken, response.refreshToken);
      
      // Optionally store user info in localStorage if needed for immediate client access
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to the intended destination or dashboard
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
      
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 mb-2" style={{ fontFamily: 'var(--font-geist-sans), serif' }}>
          J&B Antonella
        </h1>
        <p className="text-sm text-stone-500">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      <div className="bg-white/80 p-6 sm:p-8 rounded-xl border border-pink-100 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm border rounded-lg bg-red-50 border-red-200 text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700"
            >
              Correo Electrónico
            </label>
            <div className="mt-1">
                <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                {...register('email')}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors sm:text-sm shadow-sm"
                placeholder="usuario@tienda.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700"
            >
              Contraseña
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors sm:text-sm shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-lg shadow-sm hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
