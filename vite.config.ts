import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // تأكد من وجود هذا السطر ومطابقته لاسم المستودع
  base: '/raza-invoice-app/', 
  plugins: [react()],
})