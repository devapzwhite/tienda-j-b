import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tienda J&B Antonella',
    short_name: 'J&B Antonella',
    description: 'Sistema de Inventario y Ventas para Tienda J&B Antonella',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#db2777',
    icons: [
      {
        src: '/logo_app_sf_sb.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo_app_sf_sb.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  };
}
