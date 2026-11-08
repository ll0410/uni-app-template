import path from 'node:path'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      VueI18nPlugin({
        include: [path.resolve(__dirname, 'src/locales/lang/**')],
        runtimeOnly: true,
        compositionOnly: true,
      }),
      uni(),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          {
            'vue-i18n': ['useI18n'],
          },
          {
            '@dcloudio/uni-app': [
              'onLaunch',
              'onShow',
              'onHide',
              'onLoad',
              'onReady',
              'onPullDownRefresh',
              'onReachBottom',
              'onPageScroll',
              'onTabItemTap',
              'onShareAppMessage',
              'onShareTimeline',
            ],
          },
        ],
        dirs: ['src/hooks', 'src/stores/modules'],
        dts: 'src/types/auto-imports.d.ts',
        vueTemplate: true,
        eslintrc: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      // vue-i18n 9 的 JIT AST 消息需要显式开启该特性开关
      __INTLIFY_JIT_COMPILATION__: true,
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api/, ''),
        },
      },
    },
  }
})
