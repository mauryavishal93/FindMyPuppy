
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Find My Puppy',
          short_name: 'FindPuppy',
          description: 'A fun hide and seek puppy adventure game.',
          theme_color: '#FF69B4',
          background_color: '#FF69B4',
          display: 'standalone',
          icons: [
            {
              src: 'https://raw.githubusercontent.com/mauryavishal93/FindMyPuppy/main/apk/release/icon.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'https://raw.githubusercontent.com/mauryavishal93/FindMyPuppy/main/apk/release/icon.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      host: true,
      allowedHosts: true,
      proxy: {
        // Forward all requests starting with /api to the Express server
        '/api': {
          target: 'http://localhost:5174',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      allowedHosts: true,
    }
  }
})
