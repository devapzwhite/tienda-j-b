import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { AuthenticatedUser } from './interfaces/auth.interfaces.js';

/**
 * AuthController exposes authentication endpoints.
 *
 * Responsibilities (SRP): only HTTP plumbing — delegates all logic to AuthService.
 * No business logic lives here.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Validates credentials and returns access + refresh tokens.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/refresh
   * Exchanges a valid refresh token for a new token pair.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  /**
   * POST /auth/logout
   * Invalidates the current session.
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: RefreshTokenDto) {
    await this.authService.logout(dto.refreshToken);
  }

  /**
   * GET /auth/me
   * Returns the currently authenticated user's profile.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request & { user: AuthenticatedUser }) {
    return req.user;
  }
}
