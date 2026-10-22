import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    open: false,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5175',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true
  }
});
