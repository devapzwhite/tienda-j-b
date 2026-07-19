/**
 * Payload embedded inside the JWT access token.
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

/**
 * Authenticated user attached to request after JWT validation.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}
