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
    host: '0.0.0.0', // Needed for local testing
  },
  build: {
    outDir: 'dist',
  },
});


