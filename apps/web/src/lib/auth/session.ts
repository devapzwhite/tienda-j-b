'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types/auth';

const SESSION_COOKIE_NAME = 'tienda_jb_session';
const REFRESH_COOKIE_NAME = 'tienda_jb_refresh';

export async function createSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Store the access token in a secure HttpOnly cookie
  cookieStore.set(SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes (matches backend)
  });

  // Store the refresh token
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days (matches backend)
  });
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

export async function requireAuth() {
  const token = await getSessionToken();
  if (!token) {
    redirect('/login');
  }
  return token;
}
