import { LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export class AuthError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Perform login request to the NestJS API
 */
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Error en las credenciales';
      throw new AuthError(
        Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('No se pudo conectar al servidor de autenticación');
  }
}
