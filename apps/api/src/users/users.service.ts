import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        email: createUserDto.email,
        password_hash: passwordHash,
        full_name: createUserDto.name,
        user_roles: { create: createUserDto.roleIds.map((roleId) => ({
            roles: { connect: { id: roleId } },
          })),
        },
      },
      include: {
        user_roles: { include: { roles: true,
          },
        },
      },
    });

    // Exclude password hash from response
    const { password_hash: _, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      include: {
        user_roles: { include: { roles: true,
          },
        },
      },
    });

    return users.map((user) => {
      const { password_hash: passwordHash, ...result } = user;
      return result;
    });
  }

  async getRoles() {
    return this.prisma.roles.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  private async checkHierarchy(targetUserId: string, currentUser: any) {
    const targetUser = await this.prisma.users.findUnique({
      where: { id: targetUserId },
      include: { user_roles: { include: { roles: true } } },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const targetRoles = targetUser.user_roles.map(ur => ur.roles.code);
    const isTargetJefe = targetRoles.includes('jefe');
    const isCurrentUserJefe = currentUser.roles.includes('jefe');

    if (isTargetJefe && !isCurrentUserJefe) {
      throw new ForbiddenException('No tienes permisos para modificar a un usuario de nivel Jefe');
    }
  }

  async toggleStatus(id: string, isActive: boolean, currentUser: any) {
    await this.checkHierarchy(id, currentUser);
    
    const user = await this.prisma.users.update({
      where: { id },
      data: { is_active: isActive },
    });
    const { password_hash: _, ...result } = user;
    return result;
  }

  async changePassword(id: string, newPassword: string, currentUser: any) {
    await this.checkHierarchy(id, currentUser);
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = await this.prisma.users.update({
      where: { id },
      data: { password_hash: passwordHash },
    });
    const { password_hash: _, ...result } = user;
    return result;
  }

  async updateRoles(id: string, roleIds: string[], currentUser: any) {
    await this.checkHierarchy(id, currentUser);
    
    // Prevent self-demotion from 'jefe'
    if (id === currentUser.id && currentUser.roles.includes('jefe')) {
      const newRoles = await this.prisma.roles.findMany({
        where: { id: { in: roleIds } }
      });
      const hasJefe = newRoles.some(r => r.code === 'jefe');
      if (!hasJefe) {
        throw new ForbiddenException('No puedes quitarte el rol de Jefe a ti mismo por seguridad');
      }
    }

    // Delete existing roles and create new ones
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        user_roles: {
          deleteMany: {},
          create: roleIds.map(roleId => ({
            role_id: roleId
          }))
        }
      },
      include: {
        user_roles: {
          include: { roles: true }
        }
      }
    });

    const { password_hash: _, ...result } = user;
    return result;
  }
}
