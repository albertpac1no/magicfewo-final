import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MagicFewo - Ferienwohnungen & Unterkünfte',
    short_name: 'MagicFewo',
    description: 'Finden Sie die perfekte Ferienwohnung für Ihren nächsten Urlaub. Buchen Sie sicher und einfach bei MagicFewo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF385C',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
