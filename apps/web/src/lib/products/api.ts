'use server';

import { cookies } from 'next/headers';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tienda_jb_session')?.value;

  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: await getAuthHeaders(),
    next: { tags: ['products'] },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener productos');
  }

  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener el producto');
  }

  return res.json();
}

export async function createProduct(data: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear el producto');
  }

  return res.json();
}

export async function updateProduct(id: string, data: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar el producto');
  }

  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar el producto');
  }

  return res.json();
}
