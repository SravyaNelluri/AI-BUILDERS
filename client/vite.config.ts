import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'ai-builders-1.onrender.com',
      'backend-project-1-ue81.onrender.com',
    ],
  },

  server: {
    host: '0.0.0.0',
    strictPort: false,
    allowedHosts: [
      'ai-builders-1.onrender.com',
      'backend-project-1-ue81.onrender.com',
    ],
  },
})