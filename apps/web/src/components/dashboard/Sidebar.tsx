'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Punto de Venta', href: '/dashboard/pos' },
    { name: 'Ventas', href: '/dashboard/ventas' },
    { name: 'Productos', href: '/dashboard/productos' },
    { name: 'Inventario', href: '/dashboard/inventario' },
  ];

  return (
    <>
      {/* Mobile Hamburger Button (Floating Action Button en la parte inferior) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-xl border border-pink-100/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-pink-600 hover:bg-white hover:scale-105 transition-all active:scale-95"
        aria-label="Open Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <span className="font-bold text-sm tracking-wide">Menú</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Island */}
      <aside className={`
        fixed md:relative top-0 left-0 h-[calc(100dvh-2rem)]
        w-64 bg-white/70 backdrop-blur-2xl text-stone-900 flex-shrink-0 
        shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-50 md:z-10 
        m-4 md:mr-4 rounded-[2rem] border border-white flex flex-col overflow-hidden 
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:pointer-events-none
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-5 right-5 z-50 p-2 text-stone-400 hover:text-stone-700 bg-white/50 hover:bg-white rounded-xl transition-colors"
          aria-label="Close Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-24 flex items-center justify-center px-6 border-b border-stone-100/50">
          <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent tracking-widest uppercase text-center" style={{ fontFamily: 'var(--font-geist-sans), serif' }}>
            J&amp;B<br/><span className="text-sm font-semibold tracking-normal text-stone-400">Bijouteria</span>
          </span>
        </div>
        
        <nav className="relative p-4 space-y-2 flex-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white shadow-sm text-pink-600 border border-pink-100'
                    : 'text-stone-500 hover:bg-white/50 hover:text-stone-900 hover:shadow-sm'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile / Footer placeholder in the island */}
        <div className="relative p-4 mt-auto">
          <div className="bg-gradient-to-br from-pink-50/50 to-violet-50/50 p-4 rounded-2xl border border-pink-100/50 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-violet-400 mb-2 shadow-inner" />
            <p className="text-xs font-bold text-stone-700">Administrador</p>
            <p className="text-[10px] text-stone-400">admin@tiendajb.com</p>
          </div>
        </div>
      </aside>
    </>
  );
}
