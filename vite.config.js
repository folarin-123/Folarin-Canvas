import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the built site works from any folder or static host.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules/')) return undefined
          const packageName = id.split('node_modules/')[1]?.split('/')[0]
          if (packageName === 'react' || packageName === 'react-dom' || packageName === 'scheduler') return 'react-vendor'
          return undefined
        },
      },
    },
  },
})
