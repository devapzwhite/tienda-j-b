'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/lib/products/api';
import { createCategory, createBrand, createColor } from '@/lib/catalog/api';

interface Variant {
  colorId: string;
  barcode: string;
  salePrice: string;
}

interface Presentation {
  name: string;
  barcode: string;
  salePrice: string;
  variants: Variant[];
}

interface CatalogItem {
  id: string;
  name: string;
}

interface ColorItem {
  id: string;
  name: string;
  code: string;
}

interface ProductFormProps {
  categories: CatalogItem[];
  brands: CatalogItem[];
  colors: ColorItem[];
}

// ─── Inline Creator Panel ─────────────────────────────────────────────────────
function InlineCreatorPanel({
  label,
  onClose,
  onSave,
}: {
  label: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}) {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    setErr('');
    try {
      await onSave(value.trim());
      setValue('');
      onClose();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 p-3 bg-violet-50/80 border border-violet-200 rounded-2xl space-y-2">
      <p className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">
        Nueva {label}
      </p>
      <input
        ref={(el) => { if (el) setTimeout(() => el.focus(), 50); }}
        type="text"
        value={value}
        onChange={(e) => { setValue(e.target.value); setErr(''); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
          if (e.key === 'Escape') onClose();
        }}
        placeholder={`Nombre de la ${label.toLowerCase()}...`}
        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white text-stone-900 transition-colors ${err ? 'border-red-400' : 'border-violet-200'}`}
      />
      {err && <p className="text-xs text-red-500 font-medium">{err}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !value.trim()}
          className="flex-1 py-1.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-stone-500 text-xs font-bold rounded-xl hover:bg-white border border-stone-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export function ProductForm({ categories: initialCategories, brands: initialBrands, colors }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default to 1 presentation
  const [presentations, setPresentations] = useState<Presentation[]>([
    { name: 'Unidad', barcode: '', salePrice: '', variants: [] },
  ]);

  // Local mutable lists
  const [categories, setCategories] = useState<CatalogItem[]>(initialCategories);
  const [brands, setBrands] = useState<CatalogItem[]>(initialBrands);
  const [localColors, setLocalColors] = useState<ColorItem[]>(colors);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [showBrandPanel, setShowBrandPanel] = useState(false);
  const [activeColorVariant, setActiveColorVariant] = useState<{ pIndex: number; vIndex: number } | null>(null);

  // ── Presentation helpers ─────────────────────────────────────────────────
  const addPresentation = () =>
    setPresentations((prev) => {
      const firstVariants = prev.length > 0 ? prev[0].variants : [];
      const newVariants = firstVariants.map(v => ({ ...v, salePrice: '', barcode: '' }));
      return [...prev, { name: '', barcode: '', salePrice: '', variants: newVariants }];
    });

  const removePresentation = (index: number) =>
    setPresentations((prev) => prev.filter((_, i) => i !== index));

  const updatePresentation = (index: number, field: keyof Presentation, value: any) =>
    setPresentations((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );

  // ── Variant helpers ──────────────────────────────────────────────────────
  const addVariant = (presIndex: number) => {
    setPresentations((prev) =>
      prev.map((p, i) =>
        i === presIndex ? { ...p, variants: [...p.variants, { colorId: '', barcode: '', salePrice: '' }] } : p
      )
    );
  };

  const removeVariant = (presIndex: number, varIndex: number) => {
    setPresentations((prev) =>
      prev.map((p, i) =>
        i === presIndex
          ? { ...p, variants: p.variants.filter((_, vi) => vi !== varIndex) }
          : p
      )
    );
  };

  const updateVariant = (presIndex: number, varIndex: number, field: keyof Variant, value: string) => {
    setPresentations((prev) =>
      prev.map((p, i) =>
        i === presIndex
          ? {
              ...p,
              variants: p.variants.map((v, vi) =>
                vi === varIndex ? { ...v, [field]: value } : v
              ),
            }
          : p
      )
    );
  };

  // ── Inline creators ──────────────────────────────────────────────────────
  const handleCreateCategory = async (name: string) => {
    const created = await createCategory({ name });
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedCategoryId(created.id);
  };

  const handleCreateBrand = async (name: string) => {
    const created = await createBrand({ name });
    setBrands((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedBrandId(created.id);
  };

  const handleCreateColor = async (name: string) => {
    const created = await createColor({ name });
    setLocalColors((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    if (activeColorVariant) {
      updateVariant(activeColorVariant.pIndex, activeColorVariant.vIndex, 'colorId', created.id);
      setActiveColorVariant(null);
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Check if at least one presentation has a price and variants have valid colors
    if (presentations.length === 0) {
      setError('Debes añadir al menos una presentación.');
      setLoading(false);
      return;
    }

    const data = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      categoryId: selectedCategoryId,
      brandId: selectedBrandId || undefined,
      presentations: presentations.map((p) => ({
        name: p.name,
        barcode: p.barcode || undefined,
        salePrice: Number(p.salePrice),
        variants: p.variants.map(v => ({
          colorId: v.colorId,
          barcode: v.barcode || undefined,
          salePrice: v.salePrice ? Number(v.salePrice) : undefined,
        })),
      })),
    };

    try {
      await createProduct(data);
      router.push('/dashboard/productos');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors bg-white text-stone-900 text-sm';
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* ── Sección 1: Info básica ───────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-violet-600 font-bold text-sm">1</div>
          <h2 className="text-base font-extrabold text-stone-800">Información General</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nombre del Producto</label>
            <input type="text" name="name" required placeholder="Ej. Collar de Plata con diamantes" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Descripción <span className="text-stone-400 font-normal">(opcional)</span>
          </label>
          <textarea name="description" rows={3} placeholder="Describe brevemente el producto..." className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          {/* Categoría */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-stone-700">Categoría</label>
              {!showCategoryPanel && (
                <button
                  type="button"
                  onClick={() => setShowCategoryPanel(true)}
                  className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors px-2 py-0.5 rounded-lg hover:bg-violet-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva
                </button>
              )}
            </div>
            <select
              name="categoryId"
              required
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecciona...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {!showCategoryPanel && categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1.5 font-medium">
                Crea una categoría usando &quot;+ Nueva&quot;.
              </p>
            )}
            {showCategoryPanel && (
              <InlineCreatorPanel
                label="Categoría"
                onClose={() => setShowCategoryPanel(false)}
                onSave={handleCreateCategory}
              />
            )}
          </div>

          {/* Marca */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-stone-700">
                Marca <span className="text-stone-400 font-normal">(opcional)</span>
              </label>
              {!showBrandPanel && (
                <button
                  type="button"
                  onClick={() => setShowBrandPanel(true)}
                  className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors px-2 py-0.5 rounded-lg hover:bg-violet-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva
                </button>
              )}
            </div>
            <select
              name="brandId"
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className={inputClass}
            >
              <option value="">Sin marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {showBrandPanel && (
              <InlineCreatorPanel
                label="Marca"
                onClose={() => setShowBrandPanel(false)}
                onSave={handleCreateBrand}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Sección 2: Presentaciones ────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-violet-600 font-bold text-sm">2</div>
            <h2 className="text-base font-extrabold text-stone-800">Presentaciones y Colores</h2>
          </div>
          <button
            type="button"
            onClick={addPresentation}
            className="flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors px-3 py-1.5 rounded-xl hover:bg-violet-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Añadir Presentación
          </button>
        </div>

        <p className="text-xs text-stone-400">
          Define cómo se vende este producto (ej. &quot;Unidad&quot;, &quot;Caja x12&quot;) y añade colores para esa presentación si corresponde.
        </p>

        <div className="space-y-6">
          {presentations.map((p, pIndex) => (
            <div key={pIndex} className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-stone-700 text-sm">Presentación {pIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removePresentation(pIndex)}
                  disabled={presentations.length === 1}
                  className="text-stone-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Nombre (ej. Unidad)</label>
                  <input
                    type="text"
                    required
                    value={p.name}
                    onChange={(e) => updatePresentation(pIndex, 'name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Precio (Bs.)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={p.salePrice}
                    onChange={(e) => updatePresentation(pIndex, 'salePrice', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">SKU / Código (opcional)</label>
                  <input
                    type="text"
                    value={p.barcode}
                    onChange={(e) => updatePresentation(pIndex, 'barcode', e.target.value)}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-stone-600">Variantes de Color para esta presentación</p>
                  <button
                    type="button"
                    onClick={() => addVariant(pIndex)}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-2 py-1 rounded-lg"
                  >
                    + Añadir Color
                  </button>
                </div>

                {p.variants.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No hay colores. Se usará el precio y SKU principal.</p>
                ) : (
                  <div className="space-y-3">
                    {p.variants.map((v, vIndex) => (
                      <div key={vIndex} className="flex flex-col sm:flex-row gap-3 items-end p-3 bg-white rounded-xl border border-stone-100">
                        <div className="w-full sm:w-1/3 relative">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] uppercase font-bold text-stone-400">Color</label>
                            {activeColorVariant?.pIndex !== pIndex || activeColorVariant?.vIndex !== vIndex ? (
                              <button
                                type="button"
                                onClick={() => setActiveColorVariant({ pIndex, vIndex })}
                                className="text-[10px] font-bold text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 px-1.5 py-0.5 rounded"
                              >
                                + Nuevo
                              </button>
                            ) : null}
                          </div>
                          <select
                            required
                            value={v.colorId}
                            onChange={(e) => updateVariant(pIndex, vIndex, 'colorId', e.target.value)}
                            className={inputClass}
                          >
                            <option value="">Selecciona...</option>
                            {localColors.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          {activeColorVariant?.pIndex === pIndex && activeColorVariant?.vIndex === vIndex && (
                            <div className="absolute top-full left-0 w-full z-10 mt-1">
                              <InlineCreatorPanel
                                label="Color"
                                onClose={() => setActiveColorVariant(null)}
                                onSave={handleCreateColor}
                              />
                            </div>
                          )}
                        </div>
                        <div className="w-full sm:w-1/3">
                          <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Precio (Opcional)</label>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={v.salePrice}
                            placeholder="Hereda de presentacion"
                            onChange={(e) => updateVariant(pIndex, vIndex, 'salePrice', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div className="w-full sm:w-1/3">
                          <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">SKU Específico (Opcional)</label>
                          <input
                            type="text"
                            value={v.barcode}
                            placeholder="Autogenerado si vacío"
                            onChange={(e) => updateVariant(pIndex, vIndex, 'barcode', e.target.value)}
                            className={`${inputClass} font-mono`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariant(pIndex, vIndex)}
                          className="p-2.5 text-stone-300 hover:text-red-500 rounded-lg bg-stone-50 hover:bg-red-50 transition-colors mb-0.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 border border-stone-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(236,72,153,0.39)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando...' : 'Registrar Producto'}
        </button>
      </div>
    </form>
  );
}
