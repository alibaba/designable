import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const getAlias = () => {
  return {
    '@designable/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    '@designable/react': path.resolve(__dirname, '../../packages/react/src/index.ts'),
    '@designable/react-sandbox': path.resolve(__dirname, '../../packages/react-sandbox/src/index.ts'),
    '@designable/react-settings-form': path.resolve(__dirname, '../../packages/react-settings-form/src/index.ts'),
    '@designable/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    '@designable/formily-antd': path.resolve(__dirname, '../../formily/antd/src/index.ts'),
    '@designable/formily-next': path.resolve(__dirname, '../../formily/next/src/index.ts'),
    '@designable/formily-setters': path.resolve(__dirname, '../../formily/setters/src/index.ts'),
    '@designable/formily-transformer': path.resolve(__dirname, '../../formily/transformer/src/index.ts'),
    // Force single React version to avoid duplicate React error - use workspace node_modules
    'react': path.resolve(__dirname, '../../node_modules/react'),
    'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    // Handle webpack-style ~ prefix for LESS imports
    '~antd': path.resolve(__dirname, '../../node_modules/antd'),
  }
}

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
    alias: getAlias(),
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
      external: (id) => {
        // Skip .less files during build
        return id.includes('.less')
      }
    }
  }
})
