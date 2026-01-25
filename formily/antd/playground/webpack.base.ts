import path from 'path'
import fs from 'fs-extra'
import { globSync } from 'glob'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'
import type { Configuration } from 'webpack'

const getWorkspaceAlias = () => {
  const basePath = path.resolve(__dirname, '../../../')
  const pkg = fs.readJSONSync(path.resolve(basePath, 'package.json')) || {}
  const results = {}
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const found = globSync(pattern, { cwd: basePath })
      found.forEach((name) => {
        const pkg = fs.readJSONSync(
          path.resolve(basePath, name, './package.json'),
        )
        results[pkg.name] = path.resolve(basePath, name, './src')
      })
    })
  }
  return results
}

const config: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: {
    entrypoints: false,
    children: false,
  },
  entry: {
    playground: path.resolve(__dirname, './main'),
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].[contenthash].bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: getWorkspaceAlias(),
  },
  // Externals removed - React 18 + Antd 5 don't have compatible UMD builds
  module: {
    // Suppress "Critical dependency" warning for dynamic imports with variable URLs
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer()],
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset',
      },
      {
        test: /\.html?$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
    ],
  },
  // Disable performance hints - this is a dev tool with large dependencies
  performance: {
    hints: false,
  },
}

export default config
