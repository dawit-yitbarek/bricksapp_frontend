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
    port: process.env.PORT || 4173,
  },
  preview: {
    allowedHosts: ['bricks-1i79.onrender.com'],
  },
});
