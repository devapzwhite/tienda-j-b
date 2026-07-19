import { Controller, Get, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin', 'jefe', 'administrador')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin', 'jefe', 'administrador')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('admin', 'jefe', 'administrador')
  getRoles() {
    return this.usersService.getRoles();
  }

  @Patch(':id/status')
  @Roles('admin', 'jefe', 'administrador')
  toggleStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.usersService.toggleStatus(id, updateStatusDto.isActive);
  }

  @Patch(':id/password')
  @Roles('admin', 'jefe', 'administrador')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(id, changePasswordDto.newPassword);
  }
}
