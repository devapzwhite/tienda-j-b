export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white text-stone-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.15)_0%,rgba(255,255,255,0)_50%)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(251,113,133,0.1)_0%,rgba(255,255,255,0)_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          {children}
        </div>
      </div>
      
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 object-cover w-full h-full bg-pink-50 border-l border-pink-100">
          <div className="flex items-center justify-center w-full h-full p-12 opacity-40">
            <svg viewBox="0 0 100 100" className="w-64 h-64 text-pink-300" fill="currentColor">
              {/* Abstract jewelry/diamond motif */}
              <path d="M50 0L93.3 25L93.3 75L50 100L6.7 75L6.7 25L50 0ZM50 11.5L16.7 30.8L16.7 69.2L50 88.5L83.3 69.2L83.3 30.8L50 11.5Z" />
              <path d="M50 23L73.4 36.5L73.4 63.5L50 77L26.6 63.5L26.6 36.5L50 23ZM50 34.5L36.6 42.2L36.6 57.8L50 65.5L63.4 57.8L63.4 42.2L50 34.5Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
