'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLocation } from '@/lib/inventory/api';

export function LocationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('Bodega');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createLocation({
        name,
        code,
        type,
        address: address || undefined,
      });

      setSuccess('Almacén creado correctamente');
      setName('');
      setCode('');
      setAddress('');
      setType('Bodega');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors bg-white text-stone-900 text-sm';
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-medium border border-green-100">{success}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nombre del Almacén</label>
          <input
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Ej. Almacén Central Sur"
          />
        </div>

        <div>
          <label className={labelClass}>Código Único</label>
          <input
            type="text"
            required
            maxLength={30}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className={inputClass}
            placeholder="Ej. ALM-SUR-01"
          />
        </div>

        <div>
          <label className={labelClass}>Tipo de Ubicación</label>
          <select required value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="Bodega">Bodega</option>
            <option value="Tienda">Tienda</option>
            <option value="Almacén">Almacén Principal</option>
            <option value="Virtual">Virtual / Mermas</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Dirección (Opcional)</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
            placeholder="Ej. Av. Principal #123, Ciudad"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(124,58,237,0.39)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
        >
          {loading ? 'Creando...' : 'Crear Almacén'}
        </button>
      </div>
    </form>
  );
}
