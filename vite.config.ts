import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
//  base: '/snake-words/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: process.env.VITE_API_URL,
        target: 'http://localhost:8088/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
