import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  preview: {
    allowedHosts: ['https://bricksapp-frontend.onrender.com'],
  },
  build: {
    outDir: 'dist'
  }
});


