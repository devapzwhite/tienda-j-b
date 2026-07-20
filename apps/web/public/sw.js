self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A simple pass-through fetch handler is enough to satisfy the PWA installability requirements
  // for Chrome/Android. It doesn't cache anything offline to avoid conflicts with Next.js App Router cache.
  return;
});
