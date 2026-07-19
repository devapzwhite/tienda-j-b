import { Controller, Get, Post, Body, UseGuards, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateRolesDto } from './dto/update-roles.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin', 'jefe')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin', 'jefe')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('admin', 'jefe')
  getRoles() {
    return this.usersService.getRoles();
  }

  @Patch(':id/status')
  @Roles('admin', 'jefe')
  toggleStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto, @Req() req: any) {
    return this.usersService.toggleStatus(id, updateStatusDto.isActive, req.user);
  }

  @Patch(':id/password')
  @Roles('admin', 'jefe')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto, @Req() req: any) {
    return this.usersService.changePassword(id, changePasswordDto.newPassword, req.user);
  }

  @Patch(':id/roles')
  @Roles('admin', 'jefe')
  updateRoles(@Param('id') id: string, @Body() updateRolesDto: UpdateRolesDto, @Req() req: any) {
    return this.usersService.updateRoles(id, updateRolesDto.roleIds, req.user);
  }
}
