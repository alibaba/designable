import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react({ 
    jsxRuntime: 'automatic',
    // Explicitly disable React compiler - not stable with React 19
    babel: {
      plugins: [],
      babelrc: false,
      configFile: false,
    }
  })],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  server: {
    port: 3000,
  },
  esbuild: {
    target: 'esnext'
  },
  define: {
    global: 'globalThis',
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // Add antd theme variables for compatibility
          'ant-prefix': 'ant',
        },
        additionalData: `
          // Polyfill missing antd Less files
          @root-entry-name: 'default';
        `,
        javascriptEnabled: true,
        // Resolve missing antd Less imports
        paths: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, '../../node_modules'),
        ],
        // Handle webpack-style ~ prefix for antd imports
        rewriteUrls: 'all',
        alias: {
          '~antd': path.resolve(__dirname, '../../node_modules/antd'),
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sandbox: path.resolve(__dirname, 'sandbox.html'),
      },
      external: (id) => {
        // Skip .less files during build
        return id.includes('.less')
      }
    }
  }
})
