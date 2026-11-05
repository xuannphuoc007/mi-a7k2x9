import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => chạy được ở bất kỳ đường dẫn GitHub Pages nào (username.github.io/<repo>/)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          lwc: ['lightweight-charts'],
        },
      },
    },
  },
  test: { include: ['src/**/*.test.ts'] },
})
