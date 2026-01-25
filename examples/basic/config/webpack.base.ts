import path from 'path'
import fs from 'fs-extra'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const getAlias = () => {
  const packagesDir = path.resolve(__dirname, '../../../packages')
  const packages = fs.readdirSync(packagesDir)
  const alias = packages
    .map((v) => path.join(packagesDir, v))
    .filter((v) => {
      return !fs.statSync(v).isFile()
    })
    .reduce((buf, _path) => {
      const name = path.basename(_path)
      return {
        ...buf,
        [`@sulesky/next-${name}$`]: `${_path}/src`,
      }
    }, {})
  return alias
}

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: {
    entrypoints: false,
    children: false,
  },
  entry: {
    playground: path.resolve(__dirname, '../src/main'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: getAlias(),
  },
  // Externals removed - React 19 and Antd 5 don't have compatible UMD builds
  module: {
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
        test: /\.html?$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
    ],
  },
}
