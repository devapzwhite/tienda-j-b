import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUsers, getRoles } from '@/lib/users/api';
import UsersClientList from './UsersClientList';
import { getUserFromSession } from '@/lib/auth/session';

export const metadata = {
  title: 'Gestión de Usuarios | J&B Antonella',
};

export default async function UsuariosPage() {
  const [users, roles] = await Promise.all([
    getUsers(),
    getRoles()
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Usuarios</h1>
        <Link 
          href="/dashboard/usuarios/nuevo"
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(236,72,153,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] hover:scale-[1.02] active:scale-95 text-center"
        >
          + Registrar Usuario
        </Link>
      </div>

      <div className="mt-8">
        <UsersClientList initialUsers={users} availableRoles={roles} />
      </div>
    </div>
  );
}
