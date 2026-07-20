import Link from 'next/link';
import { LocationForm } from './location-form';

export const metadata = {
  title: 'Nueva Ubicación | J&B Antonella',
};

export default function NuevaUbicacionPage() {
  return (
    <div className="space-y-6 max-w-2xl pb-12 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Link
          href="/dashboard/inventario"
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Volver"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Nueva Ubicación / Almacén</h1>
          <p className="text-sm text-stone-500 mt-0.5">Registra un nuevo espacio físico o lógico para inventario.</p>
        </div>
      </div>

      <LocationForm />
    </div>
  );
}
