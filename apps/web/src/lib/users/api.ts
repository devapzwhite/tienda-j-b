'use server';

import { cookies } from 'next/headers';

// Helper to get auth headers from cookies
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tienda_jb_session')?.value;
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getUsers() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  const res = await fetch(`${API_URL}/users`, {
    headers: await getAuthHeaders(),
    next: { tags: ['users'] }, // Enable Next.js cache revalidation tag
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener usuarios');
  }

  return res.json();
}

export async function getRoles() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  const res = await fetch(`${API_URL}/users/roles`, {
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener roles');
  }

  return res.json();
}

export async function createUser(data: any) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear usuario');
  }

  return res.json();
}
export async function updateUserRoles(userId: string, roleIds: string[]) {
  const token = getToken();
  if (!token) throw new Error('No estás autenticado');

  const res = await fetch(`${API_URL}/users/${userId}/roles`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ roleIds })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar roles del usuario');
  }

  return res.json();
}
export async function toggleUserStatus(id: string, isActive: boolean) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  const res = await fetch(`${API_URL}/users/${id}/status`, {
    method: 'PATCH',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar estado del usuario');
  }

  return res.json();
}

export async function changeUserPassword(id: string, newPassword: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  const res = await fetch(`${API_URL}/users/${id}/password`, {
    method: 'PATCH',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ newPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al cambiar contraseña');
  }

  return res.json();
}
