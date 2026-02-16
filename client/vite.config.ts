import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    strictPort: false,
  },
  build: {
    rollupOptions: {
      external: [
        /^@radix-ui\/.*/,
        'react-hook-form',
        '@hookform/resolvers',
        'zod',
        'next/navigation'
      ],
      onwarn(warning) {
        // Suppress unresolved external import warnings
        if (warning.code === 'UNRESOLVED_EXTERNAL_IMPORT') {
          return
        }
      },
      output: {
        globals: {
          'react-hook-form': 'ReactHookForm'
        }
      }
    }
  }
})