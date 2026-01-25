import { resolve } from 'path'
export default {
  mode: 'site',
  logo: false,
  title: 'Designable',
  hash: true,
  favicon: false,
  outputPath: './doc-site',
  navs: [
    {
      title: 'Ant Design',
      path: '/components',
    },
    {
      title: 'GITHUB',
      path: 'https://github.com/kapelan/designable',
    },
  ],
  styles: [
    `.__dumi-default-navbar-logo{
      height: 60px !important;
      width: 150px !important;
      padding-left:0 !important;
    }
    .__dumi-default-navbar{
      padding: 0 28px !important;
    }
    .__dumi-default-layout-hero{
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-size: cover;
      background-repeat: no-repeat;
    }
    nav a{
      text-decoration: none !important;
    }
    `,
  ],
}
