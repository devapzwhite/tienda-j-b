import Link from 'next/link';
import { getLocations } from '@/lib/inventory/api';
import { getProducts } from '@/lib/products/api';
import { InventoryForm } from './inventory-form';

export const metadata = {
  title: 'Ingreso de Mercadería | J&B Bijouteria',
};

export default async function IngresoInventarioPage() {
  const [locations, products] = await Promise.all([getLocations(), getProducts()]);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Volver"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Ingreso de Mercadería</h1>
          <p className="text-sm text-stone-500 mt-0.5">Registra la entrada de stock por variante de producto.</p>
        </div>
      </div>

      <InventoryForm locations={locations} products={products} />
    </div>
  );
}
