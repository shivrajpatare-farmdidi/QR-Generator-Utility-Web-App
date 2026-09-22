import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/QR-Generator-Utility-Web-App/',
  plugins: [react()],
})
