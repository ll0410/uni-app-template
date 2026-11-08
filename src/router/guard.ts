import { useAppStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'
import { setStorage, STORAGE_KEYS } from '@/utils/storage'
import { showToast } from '@/utils/ui'

import { getRouteMeta, normalizePath } from './routes'
import { LOGIN_PATH, LOGIN_WHITELIST } from './whitelist'

let installed = false

function isWhitelisted(path: string): boolean {
  return LOGIN_WHITELIST.includes(path)
}

function redirectToLogin(target: string): void {
  setStorage(STORAGE_KEYS.pendingRoute, target)
  uni.navigateTo({
    url: `${LOGIN_PATH}?redirect=${encodeURIComponent(target)}`,
  })
}

function guardUrl(url?: string): boolean {
  if (!url) return true

  const path = normalizePath(url)
  if (isWhitelisted(path)) return true

  const userStore = useUserStore()

  if (!userStore.isLoggedIn) {
    redirectToLogin(url)
    return false
  }

  const meta = getRouteMeta(path)
  if (meta?.roles?.length) {
    const allowed = meta.roles.some((role) => userStore.roles.includes(role))
    if (!allowed) {
      const appStore = useAppStore()
      showToast(appStore.locale === 'en' ? 'No permission' : '无访问权限')
      return false
    }
  }

  return true
}

export function setupRouterGuard(): void {
  if (installed) return
  installed = true

  uni.addInterceptor('navigateTo', {
    invoke: (args) => guardUrl(args.url),
  })
  uni.addInterceptor('redirectTo', {
    invoke: (args) => guardUrl(args.url),
  })
  uni.addInterceptor('reLaunch', {
    invoke: (args) => guardUrl(args.url),
  })
  uni.addInterceptor('switchTab', {
    invoke: (args) => guardUrl(args.url),
  })
}
