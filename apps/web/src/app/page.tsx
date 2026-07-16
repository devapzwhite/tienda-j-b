export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black overflow-hidden font-sans transition-colors duration-300">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-500/20 dark:bg-pink-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]" />

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto">
        {/* Icon Container */}
        <div className="mb-8 p-5 rounded-3xl bg-white/60 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 backdrop-blur-xl shadow-2xl dark:shadow-2xl flex items-center justify-center">
          <svg
            className="w-12 h-12 text-zinc-800 dark:text-zinc-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 mb-6 drop-shadow-sm">
          En Construcción
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          Estamos trabajando para crear una experiencia increíble. 
          Vuelve pronto para descubrir todas las novedades que tenemos preparadas para ti.
        </p>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/60 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 backdrop-blur-md shadow-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-semibold tracking-wider text-zinc-800 dark:text-zinc-200 uppercase">
            Próximamente
          </span>
        </div>
      </main>
      
      {/* Minimal Footer */}
      <footer className="absolute bottom-8 w-full text-center text-sm font-medium text-zinc-500 dark:text-zinc-500">
        © {new Date().getFullYear()} Tienda JB. Todos los derechos reservados.
      </footer>
    </div>
  );
}
