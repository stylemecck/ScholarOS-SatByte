import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — loaded first, cached aggressively
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/') || id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }
          // Animation library — large but only needed for animated pages
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          // PDF processing libraries — very large, only loaded on PDF tool pages
          if (id.includes('node_modules/html2pdf') || id.includes('node_modules/pdf-lib') || id.includes('node_modules/pdfjs-dist') || id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'pdf';
          }
          // Icon library
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Auth providers
          if (id.includes('node_modules/@react-oauth') || id.includes('node_modules/jwt-decode')) {
            return 'auth';
          }
          // Toast
          if (id.includes('node_modules/sonner')) {
            return 'ui';
          }
          // Everything else (axios, helmet, etc.)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
