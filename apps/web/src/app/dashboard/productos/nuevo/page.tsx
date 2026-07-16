import Link from 'next/link';
import { getCategories, getBrands, getColors } from '@/lib/catalog/api';
import { ProductForm } from './product-form';

export const metadata = {
  title: 'Registrar Producto | J&B Bijouteria',
};

export default async function NuevoProductoPage() {
  const [categories, brands, colors] = await Promise.all([getCategories(), getBrands(), getColors()]);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/productos"
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Volver"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Registrar Producto</h1>
          <p className="text-sm text-stone-500 mt-0.5">Completa los datos para añadir un producto al catálogo.</p>
        </div>
      </div>

      <ProductForm categories={categories} brands={brands} colors={colors} />
    </div>
  );
}
