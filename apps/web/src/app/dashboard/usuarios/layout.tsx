import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth/session';

export default async function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();
  
  // Only jefe and admin can access /usuarios and /usuarios/nuevo
  if (!user?.roles?.includes('jefe') && !user?.roles?.includes('admin')) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
