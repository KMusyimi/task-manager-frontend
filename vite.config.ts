import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['framer-motion'],
  },
  build: {
    // Generates a manifest file to help with preloading assets
    manifest: true,
    // Adjusts the limit for inlining small assets (in bytes)
    assetsInlineLimit: 4096,
  }
})