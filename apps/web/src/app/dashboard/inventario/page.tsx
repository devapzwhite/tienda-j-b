import { getStock } from '@/lib/inventory/api';
import StockTable from './StockTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InventarioPage() {
  const stock = await getStock();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventario</h2>
      </div>
      <div className="hidden md:block text-gray-500 mb-4">
        Control de stock y existencias.
      </div>
      
      <StockTable initialData={stock} />
    </div>
  );
}
