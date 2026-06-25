import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gesino Reisen – Ihr Reisebüro in Frankfurt',
    short_name: 'Gesino Reisen',
    description: 'Ihr Reisebüro in Frankfurt. Buchen Sie Urlaub, Reisepakete und Ferienwohnungen sicher und einfach bei Gesino Reisen.',
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
