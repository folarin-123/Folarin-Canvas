import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the built site works from any folder or static host.
export default defineConfig({
  plugins: [react()],
  base: './',
})
