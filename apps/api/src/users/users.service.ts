import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

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
}
