import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // ensures Vite looks in current folder for index.html
  build: {
    outDir: 'dist',
  },
})
