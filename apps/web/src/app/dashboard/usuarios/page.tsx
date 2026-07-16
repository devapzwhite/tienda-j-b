import Link from 'next/link';
import { getUsers } from '@/lib/users/api';

export const metadata = {
  title: 'Gestión de Usuarios | J&B Bijouteria',
};

export default async function UsuariosPage() {
  const users = await getUsers();

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

      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {users.map((user: any) => (
            <div 
              key={user.id} 
              className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-pink-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-pink-200 transition-all duration-300 flex flex-col gap-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-stone-800 truncate">{user.name}</h3>
                  <p className="text-sm text-stone-500 truncate">{user.email}</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center text-pink-600 font-extrabold text-lg shadow-inner group-hover:scale-110 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 mt-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((r: any) => (
                    <span 
                      key={r.role.id} 
                      className="px-3 py-1 text-xs font-bold rounded-full bg-stone-50 text-stone-600 border border-stone-200/60"
                    >
                      {r.role.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-stone-100 flex justify-between items-center">
                <span className="text-[11px] font-semibold text-stone-400">
                  Registrado el {new Date(user.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button className="text-stone-300 hover:text-pink-600 transition-colors p-1" aria-label="Opciones">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-pink-100 border-dashed flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-stone-600 font-bold text-lg">No hay usuarios registrados</p>
          <p className="text-stone-400 text-sm mt-1">Crea tu primer usuario para empezar a gestionar el sistema.</p>
        </div>
      )}
    </div>
  );
}
