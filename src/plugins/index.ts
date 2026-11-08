import type { App } from 'vue'

import utils from '@/utils'

export function setupPlugins(app: App): void {
  app.config.globalProperties.$utils = utils
}
