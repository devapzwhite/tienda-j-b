import Link from 'next/link';
import { getProduct } from '@/lib/products/api';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Detalle de Producto | J&B Bijouteria',
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  let product;

  try {
    product = await getProduct(id);
  } catch (e: any) {
    return (
      <div className="p-8 text-red-500 font-bold">
        Error loading product: {e.message || String(e)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
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
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">{product.name}</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Agregado el {new Date(product.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Detalles Generales</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-stone-500 mb-1">Descripción</p>
                <p className="text-sm text-stone-800 leading-relaxed">
                  {product.description || <span className="text-stone-400 italic">Sin descripción</span>}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-500 mb-2">Clasificación</p>
                <div className="flex flex-wrap gap-2">
                  {product.categories ? (
                    <span className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-100 font-bold text-xs">
                      {product.categories.name}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-stone-50 text-stone-400 border border-stone-200 font-medium text-xs italic">
                      Sin categoría
                    </span>
                  )}
                  {product.brands ? (
                    <span className="px-3 py-1.5 rounded-xl bg-stone-50 text-stone-600 border border-stone-200 font-bold text-xs">
                      {product.brands.name}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-stone-50 text-stone-400 border border-stone-200 font-medium text-xs italic">
                      Sin marca
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presentations & Variants */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Presentaciones y Variantes</h2>
            
            {product.product_presentations?.length > 0 ? (
              <div className="space-y-4">
                {product.product_presentations.map((pres: any, i: number) => (
                  <div key={pres.id} className="border border-stone-200 rounded-2xl overflow-hidden">
                    <div className="bg-stone-50 p-4 flex flex-wrap gap-4 items-center justify-between border-b border-stone-200">
                      <div>
                        <h3 className="font-extrabold text-stone-800 text-lg flex items-center gap-2">
                          <span className="bg-violet-100 text-violet-700 w-6 h-6 flex items-center justify-center rounded-md text-xs">{i + 1}</span>
                          {pres.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-mono mt-1">SKU: {pres.barcode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Precio Venta</p>
                        <p className="text-xl font-extrabold text-violet-600">Bs. {Number(pres.sale_price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Colores disponibles</h4>
                      {pres.product_presentation_variants?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {pres.product_presentation_variants.map((v: any) => (
                            <div key={v.id} className="flex items-center justify-between p-3 border border-stone-100 rounded-xl hover:border-pink-200 hover:bg-pink-50/30 transition-colors group">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border-2 border-stone-200 shadow-sm flex items-center justify-center text-[10px] font-bold text-stone-500 bg-stone-100 overflow-hidden">
                                  {v.product_variants?.colors?.code ? (
                                    <div className="w-full h-full" style={{ backgroundColor: v.product_variants.colors.code }} />
                                  ) : (
                                    <span className="truncate max-w-[2ch]">{v.product_variants?.colors?.name?.charAt(0)}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-stone-700 text-sm">{v.product_variants?.colors?.name || 'Color Desconocido'}</p>
                                  <p className="text-[10px] text-stone-400 font-mono">SKU: {v.barcode}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-extrabold text-stone-800 text-sm">
                                  {v.sale_price && Number(v.sale_price) !== Number(pres.sale_price) ? (
                                    <span>Bs. {Number(v.sale_price).toFixed(2)}</span>
                                  ) : (
                                    <span className="text-stone-400 text-xs font-medium">Idéntico</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-stone-400 italic bg-stone-50 p-3 rounded-xl border border-dashed border-stone-200 text-center">
                          Esta presentación no tiene variaciones de color específicas.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic">No hay presentaciones registradas para este producto.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
