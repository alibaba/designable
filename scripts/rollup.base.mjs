import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import externalGlobals from 'rollup-plugin-external-globals'
import terser from '@rollup/plugin-terser'
import path from 'path'

const presets = () => {
  const externals = {
    antd: 'Antd',
    vue: 'Vue',
    react: 'React',
    moment: 'moment',
    'react-is': 'ReactIs',
    '@alifd/next': 'Next',
    'mobx-react-lite': 'mobxReactLite',
    'react-dom': 'ReactDOM',
    '@ant-design/icons': 'icons',
    '@vue/composition-api': 'VueCompositionAPI',
    '@formily/reactive-react': 'Formily.ReactiveReact',
    '@formily/reactive-vue': 'Formily.ReactiveVue',
    '@formily/reactive': 'Formily.Reactive',
    '@formily/path': 'Formily.Path',
    '@formily/shared': 'Formily.Shared',
    '@formily/validator': 'Formily.Validator',
    '@formily/core': 'Formily.Core',
    '@formily/json-schema': 'Formily.JSONSchema',
    '@formily/react': 'Formily.React',
    '@designable/shared': 'Designable.Shared',
    '@designable/core': 'Designable.Core',
    '@designable/react': 'Designable.React',
    '@designable/react-sandbox': 'Designable.ReactSandbox',
    '@designable/react-settings-form': 'Designable.ReactSettingsForm',
  }
  return [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: false,
        },
      },
    }),
    resolve(),
    postcss({
      extract: true,
      minimize: true,
      use: {
        less: {
          javascriptEnabled: true,
        },
        sass: {},
        stylus: {},
      },
    }),
    commonjs(),
    externalGlobals(externals),
  ]
}

const inputFilePath = path.join(process.cwd(), 'src/index.ts')

export const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // Remove style imports from entry file (styles are bundled separately)
    if (inputFilePath === id) {
      return code.replace(`import './style';`, '')
    }

    return code
  },
})

export default (filename, targetName, ...plugins) => {
  const commonConfig = {
    input: 'src/index.ts',
    // Suppress circular dependency warnings for known patterns
    onwarn(warning, warn) {
      // Ignore circular dependency warnings (pre-existing in codebase)
      if (warning.code === 'CIRCULAR_DEPENDENCY') return
      // Ignore "this" is undefined warnings from external modules
      if (warning.code === 'THIS_IS_UNDEFINED') return
      warn(warning)
    },
    // Set context to handle "this" references in external modules
    context: 'globalThis',
  }

  return [
    {
      ...commonConfig,
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.production.min.js`,
        name: targetName,
      },
      plugins: [...presets(filename, targetName), ...plugins],
    },
    {
      ...commonConfig,
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.production.js`,
        name: targetName,
      },
      plugins: [...presets(filename, targetName), terser(), ...plugins],
    },
  ]
}
