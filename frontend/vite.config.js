import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/api/gutendex': {
        target: 'https://gutendex.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gutendex/, '/books')
      }
    }
  }
})
