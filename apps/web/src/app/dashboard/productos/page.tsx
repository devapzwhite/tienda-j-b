import Link from 'next/link';
import { getProducts } from '@/lib/products/api';

export const metadata = {
  title: 'Productos | J&B Antonella',
};

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Productos</h1>
          <p className="text-sm text-stone-500 mt-1">{products.length} producto{products.length !== 1 ? 's' : ''} registrado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/dashboard/productos/nuevo"
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(236,72,153,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] hover:scale-[1.02] active:scale-95 text-center"
        >
          + Registrar Producto
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link
              href={`/dashboard/productos/${product.id}`}
              key={product.id}
              className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-pink-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-pink-200 transition-all duration-300 flex flex-col gap-4 group cursor-pointer block"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-stone-800 truncate">{product.name}</h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">SKU: {product.sku}</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-violet-600 font-extrabold text-lg shadow-inner group-hover:scale-110 transition-transform">
                  {product.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{product.description}</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-2 text-xs">
                {product.categories && (
                  <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 font-semibold">
                    {product.categories.name}
                  </span>
                )}
                {product.brands && (
                  <span className="px-2.5 py-1 rounded-full bg-stone-50 text-stone-600 border border-stone-200 font-semibold">
                    {product.brands.name}
                  </span>
                )}
              </div>

              {/* Price & Presentations */}
              <div className="mt-auto">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Precio Base</p>
                    <p className="text-xl font-extrabold text-stone-800">
                    Bs. {product.product_presentations?.[0]?.sale_price ? Number(product.product_presentations[0].sale_price).toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Presentaciones</p>
                    <p className="text-sm font-bold text-violet-600">{product.product_presentations?.length ?? 0}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                <span className="text-[11px] font-semibold text-stone-400">
                  {new Date(product.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div className="text-stone-300 group-hover:text-pink-600 transition-colors p-1" aria-label="Ver detalles">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-violet-100 border-dashed flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-stone-600 font-bold text-lg">No hay productos registrados</p>
          <p className="text-stone-400 text-sm mt-1">Crea tu primer producto para empezar el catálogo.</p>
          <Link
            href="/dashboard/productos/nuevo"
            className="mt-6 bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(236,72,153,0.39)] hover:scale-[1.02] transition-all"
          >
            + Registrar Producto
          </Link>
        </div>
      )}
    </div>
  );
}
