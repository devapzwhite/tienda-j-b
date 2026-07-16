# Tienda J&B - Sistema de Gestión y POS 💎

Un sistema integral de gestión de ventas, inventario y punto de venta (POS) para una tienda de bijouteria, construido con una arquitectura moderna de monorepositorio.

## 🚀 Tecnologías Principales

Este proyecto es un monorepo gestionado con [Turborepo](https://turbo.build/repo) y [pnpm](https://pnpm.io/), que separa el cliente, el servidor y la base de datos en paquetes modulares.

- **Frontend (`apps/web`):** [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend (`apps/api`):** [NestJS](https://nestjs.com/), TypeScript, JWT Authentication.
- **Base de Datos (`packages/database`):** [Prisma ORM](https://www.prisma.io/), PostgreSQL.

## 📦 Estructura del Proyecto

```text
tienda-j-b/
├── apps/
│   ├── api/           # Backend (NestJS REST API)
│   └── web/           # Frontend (Next.js App Router)
├── packages/
│   └── database/      # Prisma Schema y migraciones
├── package.json
└── pnpm-workspace.yaml
```

## ✨ Características Principales

- **Punto de Venta (POS):** Interfaz fluida para realizar ventas rápidas en mostrador, escaneo de productos y cálculo automático.
- **Gestión de Inventario Avanzado:** Control de stock desglosado por presentaciones, almacenes y variantes (colores, tamaños).
- **Catálogo de Productos:** Registro detallado de productos con soporte para jerarquías y categorías.
- **Panel de Control (Dashboard):** Interfaz Glassmorphism moderna y totalmente responsiva (móviles, tablets y PC).
- **Autenticación y Seguridad:** Inicio de sesión seguro con JWT y control de roles de usuario (Administrador, Cajero, etc.).

## ⚙️ Configuración y Despliegue Local

### Requisitos Previos

- [Node.js](https://nodejs.org/en/) (v18 o superior)
- [pnpm](https://pnpm.io/) (Gestor de paquetes)
- [PostgreSQL](https://www.postgresql.org/)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/devapzwhite/tienda-j-b.git
   cd tienda-j-b
   ```

2. Instala las dependencias en todo el workspace:
   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:
   - Copia `.env.example` a `.env` en la raíz del proyecto.
   - Configura la URL de conexión a tu base de datos PostgreSQL (`DATABASE_URL`).
   - Configura tus secretos para JWT (`JWT_SECRET`).

4. Ejecuta las migraciones de la base de datos:
   ```bash
   pnpm --filter database db:push
   # o si usas migraciones tradicionales: pnpm --filter database prisma migrate dev
   ```

5. Levanta el entorno de desarrollo:
   ```bash
   pnpm run dev
   ```
   *El frontend estará disponible en `http://localhost:3000` y la API en `http://localhost:3001`.*

## ☁️ Preparado para Despliegue en la Nube

Este proyecto está estructurado para facilitar despliegues sin fricción en plataformas modernas de nube:

- **Frontend:** Recomendado para ser desplegado en [Vercel](https://vercel.com/) (configuración automática para Next.js).
- **Backend y Base de Datos:** Recomendado para ser alojado en [Railway](https://railway.app/), Render o Fly.io.

---

Desarrollado con ❤️ para J&B Bijouteria.
