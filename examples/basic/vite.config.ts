import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Recreate @designable/* → packages/src alias
 */
// function getAlias() {
//   const packagesDir = path.resolve(__dirname, '../../../packages')
//   const packages = fs.readdirSync(packagesDir)

//   return packages.reduce<Record<string, string>>((alias, name) => {
//     const full = path.join(packagesDir, name)
//     if (fs.statSync(full).isDirectory()) {
//       alias[`@designable/${name}`] = path.join(full, 'src')
//     }
//     return alias
//   }, {})
// }

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // ...getAlias(),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,

    rollupOptions: {
      /**
       * Equivalent to webpack externals
       */
      external: ['react', 'react-dom'],

      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },
})
