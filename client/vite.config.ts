import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'ai-builders-1.onrender.com',
      'backend-project-1-ue81.onrender.com'
    ]
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'ai-builders-1.onrender.com',
      'backend-project-1-ue81.onrender.com'
    ]
  }
})