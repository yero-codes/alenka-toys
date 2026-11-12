import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/alenka-toys/', // <--- ВАЖНО: имя вашего репозитория
})