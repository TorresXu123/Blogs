import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Blogs', // 站点标题
  base: '/', //文档起始路由
  publicPath: '/', //静态资源起始路径
  exportStatic: {}, // 将所有路由输出为 HTML 目录结构，以免刷新页面时 404
  mode: 'site',
  locales: [['zh-CN', '中文']], //去除国际化,该配置为二维数组，第一项配置会作为站点默认的 locale
});
