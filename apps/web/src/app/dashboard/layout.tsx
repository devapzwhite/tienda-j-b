import { requireAuth, getUserFromSession } from '@/lib/auth/session';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure the user is authenticated before rendering the dashboard
  await requireAuth();
  
  const user = await getUserFromSession();

  return (
    <div className="flex h-screen bg-stone-100/50 overflow-hidden relative">
      {/* Elementos decorativos de fondo para que el glassmorphism resalte */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pink-50/80 to-transparent pointer-events-none" />

      {/* Sidebar estilo Isla (Responsive) */}
      <Sidebar user={user} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-white rounded-[2rem] m-2 sm:m-4 md:ml-0 shadow-sm border border-stone-100 z-10 relative">
        <div className="p-4 sm:p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
