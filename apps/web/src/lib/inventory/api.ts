'use server';

import { cookies } from 'next/headers';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tienda_jb_session')?.value;
  if (!token) throw new Error('No authentication token found');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function getLocations() {
  const res = await fetch(`${API_URL}/inventory/locations`, {
    headers: await getAuthHeaders(),
    next: { tags: ['locations'] },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener ubicaciones');
  }
  return res.json();
}

export async function receiveInventory(data: {
  locationId: string;
  productId: string;
  variantId?: string;
  quantityUnits: number;
  unitCost?: number;
}) {
  const res = await fetch(`${API_URL}/inventory/receive`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al registrar ingreso');
  }
  return res.json();
}

export async function getStock() {
  const res = await fetch(`${API_URL}/inventory/stock`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener stock');
  }
  return res.json();
}

export async function createLocation(data: {
  code: string;
  name: string;
  type: string;
  address?: string;
}) {
  const res = await fetch(`${API_URL}/inventory/locations`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear la ubicación');
  }
  return res.json();
}
