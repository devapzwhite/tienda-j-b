import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import {
  JwtPayload,
  AuthenticatedUser,
} from './interfaces/auth.interfaces.js';

/**
 * AuthService handles all authentication business logic.
 *
 * Responsibilities (SRP):
 * - Validate credentials
 * - Issue/rotate tokens
 * - Invalidate sessions
 * - Enrich user from JWT payload
 *
 * Depends on abstractions (PrismaService, JwtService, ConfigService)
 * following the Dependency Inversion Principle.
 */
@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_EXPIRY_DAYS: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.REFRESH_TOKEN_EXPIRY_DAYS = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_DAYS',
      7,
    );
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refresh_token: string; user: AuthenticatedUser }> {
    const user = await this.findActiveUserByEmail(dto.email);
    await this.verifyPassword(dto.password, user.password_hash);

    const authenticatedUser = this.mapToAuthenticatedUser(user);
    const accessToken = this.generateAccessToken(authenticatedUser);
    const refreshToken = await this.createSession(user.id);

    return { accessToken, refresh_token: refreshToken, user: authenticatedUser };
  }

  async refresh(
    rawRefreshToken: string,
  ): Promise<{ accessToken: string; refresh_token: string }> {
    const session = await this.findValidSession(rawRefreshToken);
    const user = await this.findActiveUserById(session.user_id!);

    // Rotate: delete old session, create new one
    await this.prisma.user_sessions.delete({ where: { id: session.id } });

    const authenticatedUser = this.mapToAuthenticatedUser(user);
    const accessToken = this.generateAccessToken(authenticatedUser);
    const newRefreshToken = await this.createSession(user.id);

    return { accessToken, refresh_token: newRefreshToken };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    await this.prisma.user_sessions.deleteMany({
      where: { refresh_token: rawRefreshToken },
    });
  }

  async getUserFromPayload(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.findActiveUserById(payload.sub);
    return this.mapToAuthenticatedUser(user);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private async findActiveUserByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      include: {
        user_roles: { include: { roles: { include: { role_permissions: { include: { permissions: true } } } } } }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  private async findActiveUserById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        user_roles: { include: { roles: { include: { role_permissions: { include: { permissions: true } } } } } }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  private async verifyPassword(
    plainPassword: string,
    hash: string,
  ): Promise<void> {
    const isValid = await bcrypt.compare(plainPassword, hash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  private generateAccessToken(user: AuthenticatedUser): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private async createSession(user_id: string): Promise<string> {
    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    await this.prisma.user_sessions.create({
      data: { user_id, refresh_token: refreshToken, expires_at: expiresAt },
    });

    return refreshToken;
  }

  private async findValidSession(refresh_token: string) {
    const session = await this.prisma.user_sessions.findUnique({
      where: { refresh_token },
    });

    if (!session || session.expires_at < new Date()) {
      if (session) {
        await this.prisma.user_sessions.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    return session;
  }

  private mapToAuthenticatedUser(
    user: Awaited<ReturnType<typeof this.findActiveUserById>>,
  ): AuthenticatedUser {
    const roles = user.user_roles.map((ur) => ur.roles.code);
    const permissions = [
      ...new Set(
        user.user_roles.flatMap((ur) =>
          ur.roles.role_permissions.map((rp) => rp.permissions.code),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      name: user.full_name,
      roles,
      permissions,
    };
  }
}
