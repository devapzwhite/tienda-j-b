'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserStatus, changeUserPassword } from '@/lib/users/api';

export default function UsersClientList({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal state
  const [passwordModal, setPasswordModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false,
    userId: '',
    userName: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleToggleStatus = async (user: any) => {
    try {
      setIsSubmitting(true);
      const newStatus = !user.is_active;
      await toggleUserStatus(user.id, newStatus);
      
      // Update local state
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Error al cambiar el estado del usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setPasswordError('');
      await changeUserPassword(passwordModal.userId, newPassword);
      
      // Close modal and reset
      setPasswordModal({ isOpen: false, userId: '', userName: '' });
      setNewPassword('');
      alert('Contraseña actualizada con éxito');
    } catch (error: any) {
      setPasswordError(error.message || 'Error al cambiar contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-pink-100 border-dashed flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p className="text-stone-600 font-bold text-lg">No hay usuarios registrados</p>
        <p className="text-stone-400 text-sm mt-1">Crea tu primer usuario para empezar a gestionar el sistema.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {users.map((user: any) => (
          <div 
            key={user.id} 
            className={`bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border ${user.is_active ? 'border-pink-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-pink-200' : 'border-stone-200 opacity-75'} transition-all duration-300 flex flex-col gap-4 group relative`}
          >
            {!user.is_active && (
              <div className="absolute -top-3 -right-3 bg-stone-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
                Inactivo
              </div>
            )}
            
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-stone-800 truncate">{user.full_name}</h3>
                <p className="text-sm text-stone-500 truncate">{user.email}</p>
              </div>
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${user.is_active ? 'bg-gradient-to-br from-pink-100 to-violet-100 text-pink-600' : 'bg-stone-100 text-stone-400'} flex items-center justify-center font-extrabold text-lg shadow-inner group-hover:scale-110 transition-transform`}>
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="flex-1 mt-2">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Roles</p>
              <div className="flex flex-wrap gap-2">
                {user.user_roles?.map((r: any) => (
                  <span 
                    key={r.roles.id} 
                    className="px-3 py-1 text-xs font-bold rounded-full bg-stone-50 text-stone-600 border border-stone-200/60"
                  >
                    {r.roles.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-stone-100 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-stone-400">
                Registrado el {new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => handleToggleStatus(user)}
                  disabled={isSubmitting}
                  className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors border ${user.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'} disabled:opacity-50`}
                >
                  {user.is_active ? 'Deshabilitar' : 'Habilitar'}
                </button>
                <button 
                  onClick={() => setPasswordModal({ isOpen: true, userId: user.id, userName: user.full_name })}
                  disabled={isSubmitting}
                  className="flex-1 text-xs font-bold py-2 rounded-lg transition-colors border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cambiar Clave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Password Modal */}
      {passwordModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-1">Cambiar Contraseña</h3>
              <p className="text-sm text-stone-500 mb-6">Para {passwordModal.userName}</p>
              
              <form onSubmit={handleChangePassword}>
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Nueva Contraseña</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-sm outline-none"
                    placeholder="Mínimo 6 caracteres"
                    autoFocus
                  />
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModal({ isOpen: false, userId: '', userName: '' })}
                    className="flex-1 px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || newPassword.length < 6}
                    className="flex-1 px-4 py-2 text-sm font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
