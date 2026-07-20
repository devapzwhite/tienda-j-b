'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Share, PlusSquare, Download } from 'lucide-react';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true to avoid hydration flicker
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Solo mostrar en rutas del dashboard
    if (!pathname?.startsWith('/dashboard')) {
      setShowPrompt(false);
      return;
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('Service Worker registration failed:', err);
      });
    }

    // Comprobar si ya cerraron el banner antes
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Detectar si ya está instalada (standalone)
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isInstalled);

    if (isInstalled) return;

    // Detectar iOS
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = isIOSDevice && webkit && !ua.match(/CriOS/i);

    if (isSafari) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    // Detectar Android / Chrome (beforeinstallprompt)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-96 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-4 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
        
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 relative z-10">
          <div className="shrink-0 mt-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Download className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-sm font-bold text-stone-800 mb-1">Instala nuestra App</h3>
            
            {isIOS ? (
              <div className="text-xs text-stone-500 space-y-1.5 leading-relaxed">
                <p>Para instalar en tu iPhone/iPad:</p>
                <p className="flex items-center gap-1.5 font-medium text-stone-600">
                  1. Toca compartir <Share className="w-3.5 h-3.5 text-blue-500" />
                </p>
                <p className="flex items-center gap-1.5 font-medium text-stone-600">
                  2. Luego <PlusSquare className="w-3.5 h-3.5 text-stone-700" /> Inicio
                </p>
              </div>
            ) : (
              <div className="text-xs text-stone-500 mb-3 leading-relaxed">
                Añade Tienda J&B a tu pantalla de inicio para acceso rápido y pantalla completa.
              </div>
            )}

            {!isIOS && deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="mt-2 w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors"
              >
                Instalar ahora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
