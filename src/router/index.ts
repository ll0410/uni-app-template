import { getRouteMeta } from './routes'

export const router = {
  push(url: string): void {
    uni.navigateTo({ url })
  },
  replace(url: string): void {
    uni.redirectTo({ url })
  },
  switchTab(url: string): void {
    uni.switchTab({ url })
  },
  relaunch(url: string): void {
    uni.reLaunch({ url })
  },
  back(delta = 1): void {
    uni.navigateBack({ delta })
  },
  isTabPage(url: string): boolean {
    return Boolean(getRouteMeta(url)?.tabBar)
  },
}

export { setupRouterGuard } from './guard'
export { getRouteMeta, normalizePath, routeMeta } from './routes'
export { LOGIN_PATH, LOGIN_WHITELIST } from './whitelist'
