'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronRight, 
  PlusCircle, 
  Package, 
  MapPin, 
  Layers,
  Search
} from 'lucide-react';

type LocationData = {
  name: string;
  code: string;
};

type InventoryStock = {
  quantity_units: number;
  locations: LocationData;
};

type ProductVariant = {
  colors: {
    name: string;
    code: string;
  };
};

type ProductStockUnit = {
  id: string;
  unit_name: string;
  inventory_stock: InventoryStock[];
  product_variants: ProductVariant | null;
};

type ProductData = {
  id: string;
  name: string;
  categories: { name: string } | null;
  product_stock_units: ProductStockUnit[];
};

export default function StockTable({ initialData }: { initialData: ProductData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredData = initialData.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <Link 
          href="/dashboard/inventario/ingreso"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
        >
          <PlusCircle className="h-5 w-5" />
          Registrar Ingreso
        </Link>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-3 sm:px-6 py-4 rounded-tl-2xl w-10 sm:w-12"></th>
                <th className="px-3 sm:px-6 py-4">Producto</th>
                <th className="hidden sm:table-cell px-6 py-4">Categoría</th>
                <th className="px-3 sm:px-6 py-4 text-right rounded-tr-2xl">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm">No se encontraron productos.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((product) => {
                  const isExpanded = expandedRows.has(product.id);
                  
                  // Calculate total stock for this product across all units and locations
                  const totalStock = product.product_stock_units.reduce((acc, unit) => {
                    return acc + unit.inventory_stock.reduce((sum, stock) => sum + stock.quantity_units, 0);
                  }, 0);

                  return (
                    <React.Fragment key={product.id}>
                      {/* Parent Row */}
                      <tr 
                        onClick={() => toggleRow(product.id)}
                        className={`group cursor-pointer transition-colors hover:bg-gray-50/50 ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                      >
                        <td className="px-3 sm:px-6 py-4">
                          <button className="text-gray-400 group-hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-100/50">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden sm:flex h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 items-center justify-center text-gray-500 shrink-0">
                              <Package className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors break-words text-sm sm:text-base line-clamp-2">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <Layers className="h-3 w-3" />
                            {product.categories?.name || 'Sin Categoría'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right">
                          <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 sm:px-3 py-1 rounded-full text-sm font-bold ${
                            totalStock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {totalStock}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Content (Variants Breakdown) */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={4} className="p-0 border-b-0 bg-gray-50/30">
                            <div className="px-4 sm:px-8 py-4 sm:py-6 sm:pl-20 animate-in slide-in-from-top-2 fade-in duration-200">
                              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Layers className="h-4 w-4 text-indigo-500" />
                                Desglose por Variante
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {product.product_stock_units.map((unit) => {
                                  const colorName = unit.product_variants?.colors?.name || 'Base';
                                  const colorCode = unit.product_variants?.colors?.code || '#ccc';
                                  
                                  const unitTotal = unit.inventory_stock.reduce((sum, s) => sum + s.quantity_units, 0);

                                  return (
                                    <div key={unit.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                          {unit.product_variants?.colors ? (
                                            <div 
                                              className="w-4 h-4 rounded-full ring-2 ring-gray-100" 
                                              style={{ backgroundColor: colorCode }}
                                              title={colorName}
                                            />
                                          ) : (
                                            <div className="w-4 h-4 rounded-full bg-gray-200 ring-2 ring-gray-100" />
                                          )}
                                          <span className="font-medium text-sm text-gray-800 uppercase">
                                            {colorName}
                                          </span>
                                        </div>
                                        <span className={`text-sm font-bold ${unitTotal > 0 ? 'text-gray-900' : 'text-rose-500'}`}>
                                          {unitTotal} ud.
                                        </span>
                                      </div>
                                      
                                      {/* Locations List */}
                                      <div className="space-y-2.5">
                                        {unit.inventory_stock.length > 0 ? (
                                          unit.inventory_stock.map((stock, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                              <div className="flex items-center gap-1.5 text-gray-500">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{stock.locations.name}</span>
                                              </div>
                                              <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                                                {stock.quantity_units}
                                              </span>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-xs text-gray-400 italic text-center py-2">
                                            Sin existencias registradas
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {product.product_stock_units.length === 0 && (
                                <div className="text-sm text-gray-500 italic p-4 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                                  Este producto aún no tiene unidades de stock generadas.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
