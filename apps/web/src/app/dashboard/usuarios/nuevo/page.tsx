import { getRoles } from '@/lib/users/api';
import { UserForm } from './user-form';

export const metadata = {
  title: 'Nuevo Usuario | J&B Bijouteria',
};

export default async function NuevoUsuarioPage() {
  const roles = await getRoles();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <a href="/dashboard/usuarios" className="text-stone-400 hover:text-pink-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 className="text-2xl font-semibold text-stone-800">Registrar Usuario</h1>
      </div>
      
      <UserForm roles={roles} />
    </div>
  );
}
