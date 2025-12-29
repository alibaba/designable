import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  root: 'playground',
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      entry: 'main.tsx',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'playground/widgets'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  server: {
    port: 4000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'playground/index.html'),
      },
    },
  },
});
