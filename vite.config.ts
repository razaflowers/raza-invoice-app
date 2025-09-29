// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/raza-invoice-app/', // <-- تأكد من وجود هذا السطر بالضبط
  plugins: [react()],
})