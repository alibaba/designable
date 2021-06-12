import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    open: true,
  },
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: /\@designable\/(.*)/,
        replacement: path.resolve(__dirname, '../../packages/$1/src'),
      },
      { find: /^~/, replacement: '' }, //@import '~antd/lib/style/themes/default.less';
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
