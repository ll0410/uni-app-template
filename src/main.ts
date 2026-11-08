import { createSSRApp } from 'vue'

import App from './App.vue'
import { i18n } from './locales'
import { setupPlugins } from './plugins'
import { setupRouterGuard } from './router'
import { pinia } from './stores'
import { useUserStore } from './stores/modules/user'

export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  app.use(i18n)
  setupPlugins(app)

  uni.$on('auth:expired', () => {
    useUserStore().reset()
    uni.reLaunch({ url: '/pages/login/index' })
  })

  setupRouterGuard()

  return { app }
}
