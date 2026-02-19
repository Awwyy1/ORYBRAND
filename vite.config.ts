import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          },
        },
      },
      plugins: [tailwindcss(), react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // H20: Build optimizations for Lighthouse
      build: {
        target: 'es2020',
        cssMinify: true,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-router': ['react-router-dom'],
              'vendor-motion': ['framer-motion'],
            },
          },
        },
      },
    };
});
