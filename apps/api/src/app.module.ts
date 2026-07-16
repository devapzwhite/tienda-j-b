import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { ColorsModule } from './colors/colors.module.js';
import { InventoryModule } from './inventory/inventory.module.js';

/**
 * AppModule is the root composition module.
 * It imports all feature modules following the feature-module pattern.
 * No business logic lives here.
 */
@Module({
  imports: [
    // Load environment variables globally — must be first
    ConfigModule.forRoot({ isGlobal: true }),
    // DB connection — global, so all feature modules can inject PrismaService
    PrismaModule,
    // Auth feature module
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    ColorsModule,
    InventoryModule,
  ],
})
export class AppModule {}
