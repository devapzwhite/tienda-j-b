'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { receiveInventory } from '@/lib/inventory/api';

export function InventoryForm({ locations, products }: { locations: any[]; products: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [locationId, setLocationId] = useState('');
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);
  
  let variants: any[] = [];
  if (selectedProduct?.product_presentations) {
    const varMap = new Map();
    for (const pres of selectedProduct.product_presentations) {
      if (pres.product_presentation_variants) {
        for (const pv of pres.product_presentation_variants) {
          if (pv.product_variants) {
            varMap.set(pv.product_variants.id, pv.product_variants);
          }
        }
      }
    }
    variants = Array.from(varMap.values());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!locationId || !productId || !quantity) {
        throw new Error('Completa todos los campos obligatorios');
      }

      await receiveInventory({
        locationId,
        productId,
        variantId: variantId || undefined,
        quantityUnits: Number(quantity),
      });

      setSuccess('Ingreso registrado correctamente');
      setVariantId('');
      setQuantity('');
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
          <label className={labelClass}>Ubicación / Almacén</label>
          <select required value={locationId} onChange={(e) => setLocationId(e.target.value)} className={inputClass}>
            <option value="">Selecciona una ubicación...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Producto</label>
          <select required value={productId} onChange={(e) => { setProductId(e.target.value); setVariantId(''); }} className={inputClass}>
            <option value="">Selecciona un producto...</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
        </div>

        {variants.length > 0 && (
          <div className="sm:col-span-2">
            <label className={labelClass}>Variante (Color)</label>
            <select required value={variantId} onChange={(e) => setVariantId(e.target.value)} className={inputClass}>
              <option value="">Selecciona una variante...</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>{v.colors?.name || v.id}</option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass}>Cantidad Ingresada (Unidades)</label>
          <input type="number" required min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} placeholder="Ej. 50" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(124,58,237,0.39)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
        >
          {loading ? 'Registrando...' : 'Registrar Ingreso'}
        </button>
      </div>
    </form>
  );
}
