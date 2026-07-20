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

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    headers: await getAuthHeaders(),
    next: { tags: ['categories'] },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener categorías');
  }

  return res.json();
}

export async function getBrands() {
  const res = await fetch(`${API_URL}/brands`, {
    headers: await getAuthHeaders(),
    next: { tags: ['brands'] },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener marcas');
  }

  return res.json();
}

export async function getColors() {
  const res = await fetch(`${API_URL}/colors`, {
    headers: await getAuthHeaders(),
    next: { tags: ['colors'] },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener colores');
  }

  return res.json();
}

export async function createCategory(data: { name: string; description?: string }) {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear la categoría');
  }

  return res.json();
}

export async function createBrand(data: { name: string; description?: string }) {
  const res = await fetch(`${API_URL}/brands`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear la marca');
  }

  return res.json();
}

export async function createColor(data: { name: string; code?: string }) {
  const res = await fetch(`${API_URL}/colors`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear el color');
  }

  return res.json();
}

