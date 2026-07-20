'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Check, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { getProducts } from '@/lib/products/api';

interface ProductAutocompleteProps {
  onSelect: (product: any | null) => void;
  selectedProduct?: any | null;
}

export function ProductAutocomplete({ onSelect, selectedProduct }: ProductAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initial load or search load
  useEffect(() => {
    let isMounted = true;
    
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const data = await getProducts(debouncedSearchTerm);
        if (isMounted) {
          setOptions(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
        if (isMounted) setOptions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (product: any) => {
    onSelect(product);
    setSearchTerm(''); // Clear search on select to keep it clean
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setSearchTerm('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input area */}
      <div 
        className="relative w-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {selectedProduct ? (
          <div className="w-full px-4 py-2.5 border border-violet-200 bg-violet-50 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <Check className="w-4 h-4 text-violet-600 flex-shrink-0" />
              <span className="font-semibold text-violet-900 truncate">
                {selectedProduct.name}
              </span>
            </div>
            <button 
              type="button" 
              onClick={handleClear}
              className="p-1 hover:bg-violet-100 rounded-full text-violet-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors bg-white text-stone-900 text-sm"
              placeholder="Buscar producto por nombre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !selectedProduct && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden max-h-60 overflow-y-auto">
          {options.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-stone-500 text-center">
              No se encontraron productos
            </div>
          ) : (
            <ul className="py-1">
              {options.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="px-4 py-2 hover:bg-stone-50 cursor-pointer text-sm text-stone-700 hover:text-stone-900 flex items-center gap-2 border-b border-stone-50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    {product.categories?.name && (
                      <p className="text-xs text-stone-400 truncate">{product.categories.name}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
