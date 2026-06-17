import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'S-Link',
    short_name: 'S-Link',
    description: '学生生活を支援する統合プラットフォーム',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#317EFB',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: "maskable"
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: "maskable"
      },
    ],
  }
}
