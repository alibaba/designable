import path from 'node:path'
import { fileURLToPath } from 'node:url'

import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function createConfig(libraryName, globalName) {
  return {
  input: 'src/index.ts',

  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: globalName,
      sourcemap: true,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd',
        '@designable/core': 'Designable.Core',
        '@designable/shared': 'Designable.Shared'
      }
    }
  ],

  external: [
    'react',
    'react-dom',
    'antd',
    '@formily/reactive',
    '@formily/reactive-react',
    '@formily/path',
    '@formily/shared',
    '@formily/json-schema',
    '@designable/shared',
    '@designable/core'
  ],

  plugins: [
    resolve({
      extensions: ['.js', '.ts']
    }),

    commonjs(),

    typescript({
      tsconfig: './tsconfig.rollup.json',
      declaration: false
    }),

    postcss({
      extract: true,
      minimize: true
    }),

    terser()
  ]
  }
}
